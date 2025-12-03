const tf = require('@tensorflow/tfjs');
const path = require('path');
const fs = require('fs');

const localModelPath = path.join(__dirname, '..', 'models', 'ops-anomaly');

// Mock data generator for training
function generateMockData(numSamples) {
    const features = [];
    const labels = [];

    for (let i = 0; i < numSamples; i++) {
        // Features: [http5xx_last5min (norm), latency_p95 (norm), cpu (norm), mem (norm)]
        // Normal behavior
        let http5xx = Math.random() * 0.1;
        let latency = Math.random() * 0.3;
        let cpu = Math.random() * 0.6;
        let mem = Math.random() * 0.6;
        let isAnomaly = 0;

        // Inject anomalies
        if (Math.random() < 0.2) {
            isAnomaly = 1;
            if (Math.random() < 0.5) {
                http5xx = 0.5 + Math.random() * 0.5; // High errors
            } else {
                latency = 0.6 + Math.random() * 0.4; // High latency
            }
        }

        features.push([http5xx, latency, cpu, mem]);
        labels.push([isAnomaly]);
    }

    return {
        xs: tf.tensor2d(features),
        ys: tf.tensor2d(labels)
    };
}

async function trainModel() {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 8, activation: 'relu', inputShape: [4] }));
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

    model.compile({
        optimizer: tf.train.adam(0.01),
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
    });

    const { xs, ys } = generateMockData(1000);

    console.log('Training model...');
    await model.fit(xs, ys, {
        epochs: 10,
        batchSize: 32,
        shuffle: true,
        callbacks: {
            onEpochEnd: (epoch, logs) => console.log(`Epoch ${epoch}: loss=${logs.loss.toFixed(4)} acc=${logs.acc.toFixed(4)}`)
        }
    });

    // Save model manually using fs
    if (!fs.existsSync(localModelPath)) {
        fs.mkdirSync(localModelPath, { recursive: true });
    }

    const saveResult = await model.save(tf.io.withSaveHandler(async (artifacts) => {
        const modelTopology = artifacts.modelTopology;
        const weightSpecs = artifacts.weightSpecs;
        const weightData = artifacts.weightData; // ArrayBuffer

        const modelJson = {
            modelTopology,
            weightsManifest: [{
                paths: ['./weights.bin'],
                weights: weightSpecs
            }],
            format: artifacts.format,
            generatedBy: artifacts.generatedBy,
            convertedBy: artifacts.convertedBy
        };

        fs.writeFileSync(path.join(localModelPath, 'model.json'), JSON.stringify(modelJson, null, 2));
        fs.writeFileSync(path.join(localModelPath, 'weights.bin'), Buffer.from(weightData));

        return {
            modelArtifactsInfo: {
                dateSaved: new Date(),
                modelTopologyType: 'JSON',
                weightDataBytes: weightData.byteLength
            }
        };
    }));
    console.log('Model saved to ' + localModelPath);
}

let loadedModel = null;

async function detectAnomaly(features) {
    // features: [http5xx, latency, cpu, mem]
    if (!loadedModel) {
        try {
            // Load manually
            const modelJson = JSON.parse(fs.readFileSync(path.join(localModelPath, 'model.json')));
            const weightData = fs.readFileSync(path.join(localModelPath, 'weights.bin'));

            loadedModel = await tf.loadLayersModel(tf.io.fromMemory({
                modelTopology: modelJson.modelTopology,
                weightSpecs: modelJson.weightsManifest[0].weights,
                weightData: weightData.buffer.slice(weightData.byteOffset, weightData.byteOffset + weightData.byteLength)
            }));
        } catch (e) {
            console.error("Model not found or load error, training new one...", e.message);
            await trainModel();
            // Reload
            const modelJson = JSON.parse(fs.readFileSync(path.join(localModelPath, 'model.json')));
            const weightData = fs.readFileSync(path.join(localModelPath, 'weights.bin'));
            loadedModel = await tf.loadLayersModel(tf.io.fromMemory({
                modelTopology: modelJson.modelTopology,
                weightSpecs: modelJson.weightsManifest[0].weights,
                weightData: weightData.buffer.slice(weightData.byteOffset, weightData.byteOffset + weightData.byteLength)
            }));
        }
    }

    const tensor = tf.tensor2d([features]);
    const prediction = loadedModel.predict(tensor);
    const score = (await prediction.data())[0];

    return {
        score: score,
        flag: score > 0.6
    };
}

module.exports = { trainModel, detectAnomaly };
