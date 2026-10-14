# Security and confidentiality review

## Controls implemented

- No production spreadsheet IDs, endpoints, API keys, tokens, internal domains, company branding, or real customer records are included.
- All mutation endpoints verify an opaque expiring session and authorized role on the server. Client navigation is not treated as authorization.
- Passwords are stored as per-user salted SHA-256 hashes for a demonstrative portfolio setup. Passwords are never logged or returned.
- Input is type-checked and bounded. User-generated text removes markup-significant characters and is rendered with `textContent`.
- Script locks guard queue claims, interaction creation, verification, assignment, and configuration writes.
- Interaction request IDs make retries idempotent. A lost or expired work lock rejects the save.
- Opting out changes the customer consent/status. Closed work cannot be reassigned.
- Audit events track the actor and operation without storing secrets.

## Deliberate limitations before production use

This is a portfolio implementation, not a production security certification. SHA-256 password verification is included to show the design boundary; production deployment should use Google Workspace identity, OAuth/OIDC, a proper identity provider, password reset and MFA rather than custom credentials. Session data is cache-backed, so deployments should define a robust revocation mechanism. Sheets sharing must be least-privilege, protected ranges should be configured, audit exports retained according to policy, and access/legal review completed for every region.

Before public deployment, replace all demo users and passwords, use a restricted web-app audience, review OAuth scopes, establish a data-retention policy, add rate limiting or an identity-aware gateway, and perform a security review of any new integration. Do not use synthetic examples as a reason to place personal data in a public repository.

