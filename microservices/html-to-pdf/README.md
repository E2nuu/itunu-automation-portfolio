# HTML → PDF Microservice (Self-Hosted)

A **self-hosted HTML to PDF conversion service** built for automation workflows.

This service lets you send raw HTML to a secure HTTP endpoint and receive a **generated PDF file** in response. It is designed to be reliable, fast, and easy to integrate with tools like **n8n**, backend services, and internal automation pipelines.

The service runs entirely on your own server and is protected using an API key.

---

## Who This Is For

This service is for:

- Automation builders using **n8n**
- Developers who need server-side HTML → PDF conversion
- Teams generating PDFs from emails, reports, invoices, or documents
- Anyone who wants a **self-hosted** alternative to SaaS PDF tools

This service is **not** for:

- Frontend-only usage (it runs on a server)
- Shared hosting environments
- Users who cannot run Docker

---

## What You Get

When you purchase this product, you receive:

- A ready-to-run **Docker-based microservice**
- Simple start/stop scripts
- Environment configuration template
- A complete **README** with step-by-step setup
- A prebuilt **n8n workflow** for quick integration

> ⚠️ **Source code is not included**  
> The service is distributed as a sealed runtime container.

---

## System Requirements

You need:

- A Linux server (Ubuntu 20.04+ recommended)
- Docker
- Docker Compose
- An open TCP port (example: `3005`)

No Node.js, browser setup, or PDF libraries are required.

---

## Quick Start (5 Minutes)

```bash
# 1. Unzip the downloaded folder
cd html-to-pdf-service

# 2. Copy environment file
cp .env.example .env

# 3. Edit your API key
nano .env

# 4. Run setup (one time)
chmod +x install.sh start.sh stop.sh
./install.sh

# 5. Start the service
./start.sh 
```
Your service will now be running.

## Configuration (API Key & Port)

Open the `.env` file:

```env
PORT=3005
API_KEY=change-this-to-a-secret-value
```
- PORT → The port your service listens on

- API_KEY → A secret string required for all requests

- Use a long, random value for your API key.

## Starting & Stopping the Service

Start the service:
```
./start.sh
```
Stop the service:
```
./stop.sh
```
Check running containers:
```
docker ps
```
## Firewall & Port Setup

Make sure your server allows inbound traffic on the chosen port.

Example using UFW:
```
sudo ufw allow 3005
sudo ufw reload
```

## Testing the Service (curl)

Example request:
```
curl -X POST http://localhost:3005/convert \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "html": "<h1>Hello World</h1>",
    "filename": "example.pdf"
  }' \
  --output example.pdf
```

## Using With n8n

This package includes a ready-made n8n workflow.

### HTTP Request Node Settings

* **Method:** `POST`
* **URL:** `http://YOUR_SERVER_IP:3005/convert`
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
## Included n8n Workflow

The `n8n/html-to-pdf-workflow.json` file demonstrates:

* **Sending HTML content**: How to structure the JSON payload.
* **Receiving a PDF**: Handling the binary response from the microservice.
* **Saving or forwarding the file**: Examples of what to do with the generated PDF (e.g., saving to disk or sending via email).

You can import this file directly into your n8n instance by copying the JSON content and pasting it into the workflow canvas.

## Troubleshooting

* **Service not responding**
    * Check if Docker is running
    * Confirm the port is open
    * Verify your API key
* **401 Unauthorized**
    * Ensure `x-api-key` matches the value in your `.env` file
* **PDF not returned**
    * Confirm response format is set to **File**
    * Check that the request body is valid JSON

---

## Security Notes

* Always use a **strong API key**.
* Do not expose the port publicly without **firewall rules**.
* Rotate API keys immediately if compromised.
* This service is intended for **private infrastructure** usage.

---

## License & Usage Terms

* Single-server usage per purchase.
* No redistribution or resale.
* No reverse engineering.
* No source code access.
* **Commercial usage allowed** for your own projects.

---

## Support & Updates

This product includes documentation-based support. Updates and fixes may be provided periodically. 

Check the Gumroad page for announcements.

**© Self-hosted HTML → PDF Microservice**
