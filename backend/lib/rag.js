let pipeline;
let embedder = null;

async function getEmbedder() {
    if (!pipeline) {
        const transformers = await import('@xenova/transformers');
        pipeline = transformers.pipeline;
    }
    if (!embedder) {
        console.log('Loading embedding model...');
        embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        console.log('Embedding model loaded.');
    }
    return embedder;
}

async function embedText(text) {
    const pipe = await getEmbedder();
    const output = await pipe(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
}

// Helper to serialize float32 array to buffer for SQLite BLOB
function float32ArrayToBuffer(arr) {
    return Buffer.from(new Float32Array(arr).buffer);
}

// Helper to deserialize buffer to float32 array
function bufferToFloat32Array(buf) {
    return new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4);
}

function cosineSimilarity(vecA, vecB) {
    let dot = 0.0;
    let normA = 0.0;
    let normB = 0.0;
    for (let i = 0; i < vecA.length; i++) {
        dot += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

module.exports = { embedText, float32ArrayToBuffer, bufferToFloat32Array, cosineSimilarity };
