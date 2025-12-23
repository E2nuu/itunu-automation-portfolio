# HTML → PDF Microservice (Self-Hosted)

A **self-hosted HTML to PDF conversion microservice** built for automation workflows, backend systems, and internal tools.

This service allows you to send raw HTML to a secure HTTP endpoint and receive a **generated PDF file** in response. It is designed to be reliable, predictable, and easy to integrate with tools like **n8n**, backend services, and internal automation pipelines.

The service runs entirely on your own infrastructure and is protected using an API key.

---

## Who This Is For

This service is for:

- Automation builders using **n8n**
- Backend and product engineers
- Teams generating PDFs from reports, invoices, emails, or internal documents
- Anyone who wants a **self-hosted alternative** to PDF SaaS tools

This service is **not** for:

- Frontend-only usage
- Shared hosting environments
- Users who cannot run Docker

---

## What You Get

This project provides:

- A ready-to-run **Docker-based microservice**
- A documented HTTP API for HTML → PDF generation
- Environment-based configuration (API key & port)
- Clear setup and usage instructions
- Automation-ready design (tool-agnostic)

> ⚠️ **Source code is intentionally not included**  
> The service is distributed as a sealed Docker runtime.

---

## System Requirements

You need:

- Docker
- Linux, macOS, or Windows
- Minimum **2GB RAM** recommended
- An available TCP port (example: `3005`)
> Note: The Docker image includes a headless Chromium runtime for PDF rendering, which increases image size. This is expected for reliable HTML → PDF conversion.

No Node.js, browser installation, or PDF libraries are required on the host system.

---

## Installation (Docker)

Pull the image from Docker Hub:

```bash
docker pull e2nuu/html-to-pdf-microservice
```
## Running the Service

Start the service using Docker:
```bash
docker run -d \
  -p 3005:3005 \
  -e PORT=3005 \
  -e API_KEY=your-secret-key \
  --name html-to-pdf \
  e2nuu/html-to-pdf-microservice
```
The service will now be running and listening on port 3005.

## Starting & Stopping the Service
### Start
```bash
docker start html-to-pdf
```
### Stop
```bash
docker stop html-to-pdf
```
### Check status
```bash
docker ps
```
### Remove the Service Completely

```bash
docker stop html-to-pdf
docker rm html-to-pdf
```
This removes the running container but keeps the Docker image on your system.

### Configuration (API Key & Port)

Configuration is done via environment variables.

| Variable | Description |
| :--- | :--- |
|  **PORT** | Internal port the service listens on (must match Docker `-p` mapping) |
| **API_KEY** | Secret key required for all requests |

> [!TIP]
> Choose a long, random API key and keep it private.

## Health Check
```bash
curl http://localhost:3005/health \
  -H "x-api-key: your-secret-key"
```
### Expected Response
```bash
{ "status": "ok" }
```
If this returns `{ "status": "ok" }`, the service is ready to use.


## Generate a PDF (API Usage)

### Endpoint
```bash
POST /html-to-pdf
```

### Headers
```bash
Content-Type: application/json
x-api-key: YOUR_API_KEY
```

### Request Body
```bash
{
  "html": "<html><body><h1>Hello PDF</h1></body></html>",
  "filename": "example.pdf"
}
```

### Example with curl
```bash
curl -X POST http://localhost:3005/html-to-pdf \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "html": "<html><body><h1>Hello World</h1></body></html>",
    "filename": "example.pdf"
  }' \
  --output example.pdf
```
The response will be a valid PDF file.

## Using With n8n

This service integrates cleanly with n8n using the **HTTP Request** node.

### HTTP Request Node Settings

* **Method:** `POST`
* **URL:** `http://YOUR_SERVER_IP:3005/html-to-pdf`
* **Headers:**
    * `Content-Type`: `application/json`
    * `x-api-key`: `YOUR_API_KEY`
* **Body Type:** `JSON`
* **Response Format:** `File`
* **Binary Property:** `data`

### Body Example
```json
{
  "html": "<html><body><h1>PDF from n8n</h1></body></html>",
  "filename": "n8n-document.pdf"
}
```

## Firewall & Port Setup

If deploying on a server, ensure the port is allowed.

Example using UFW:
```bash
sudo ufw allow 3005
sudo ufw reload
```
## Troubleshooting

### Service not responding
* **Ensure Docker is running**: Check your system's Docker status.
* **Confirm the container is started**: Run `docker ps` to see if the container is active.
* **Verify the port mapping**: Ensure your host port (e.g., `3005`) matches the port defined in the `docker run` command.

### 401 Unauthorized
* **Ensure the x-api-key header matches API_KEY**: Double-check that the key provided in your request header matches the one set in your environment variables.

### PDF not returned
* **Confirm endpoint is `/html-to-pdf`**: Verify that you are sending the request to the correct path.
* **Ensure response format is set to File**: In tools like n8n, make sure the output is handled as binary/file data.
* **Check container logs**:
  ```bash
  docker logs html-to-pdf
   ```

   ### Interpreting Container Logs
To see what is happening inside the service, run:
`docker logs html-to-pdf`

| Log Message / Code | Meaning | Action |
| :--- | :--- | :--- |
| **"Authentication failed" (401)** | The `x-api-key` is missing or incorrect. | Check your request headers and `.env` file. |
| **"Invalid JSON body" (400)** | The request was sent with broken syntax. | Ensure your HTML is wrapped in a valid JSON object. |
| **"Navigation timeout"** | The service couldn't render the HTML fast enough. | Check if your HTML is trying to load large external images/scripts. |
| **"Exited with code 137"** | The container ran out of memory (OOM). | Increase the RAM limit on your Docker host. |

## Security Notes

* **Always use a strong API key**: Avoid simple passwords; use a long, random alphanumeric string.
* **Do not expose the port publicly**: Use firewall rules (like `ufw` or cloud security groups) to restrict access to trusted IPs only.
* **Rotate API keys**: If you suspect your key has been leaked, update your environment variables immediately.
* **Controlled Infrastructure**: This service is intended for use within **private or controlled infrastructure** rather than open public access.

---

## License & Usage

* **Personal & Commercial**: Free to use for both personal and commercial projects.
* **No Redistribution**: You may not redistribute or resell the Docker image.
* **No Reverse Engineering**: Modification or deconstruction of the service is prohibited.
* **Closed Source**: Source code is not included by design; the service is provided as a pre-built runtime.

---

## Author

**Built by Itunu** *Automation Engineer & Product Builder*

* **Email**: [ceo@cexlisting.com](mailto:ceo@cexlisting.com)
* **Gumroad**: [e2nu.gumroad.com](https://e2nu.gumroad.com/)
* **n8n Creator Page**: [n8n.io/creators/e2nu/](https://n8n.io/creators/e2nu/)

> Built with clarity, discipline, and an automation-first mindset.
