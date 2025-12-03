# KB-1: Billing Invoice Missing
If a customer reports a missing invoice, check the Stripe dashboard. If the payment failed, the invoice won't be generated until retried.

# KB-2: VPN Connection Issues
If a user cannot connect to VPN, check if their certificate is expired. Also verify they are using the correct gateway address (vpn.company.com).

# KB-3: Application 503 Errors
503 Service Unavailable usually means the backend pods are down or overloaded. Check the load balancer logs and restart the service if memory is high.

# KB-4: MFA Reset Procedure
To reset MFA, verify the user's identity via video call or manager approval. Then use the admin panel to 'Clear MFA Factors'.
