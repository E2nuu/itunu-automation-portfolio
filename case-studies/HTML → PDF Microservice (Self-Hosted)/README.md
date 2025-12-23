## Overview

I designed and shipped a **self-hosted HTML → PDF microservice** to support automation workflows and backend systems. The service converts raw HTML into PDF documents via a secure HTTP API and is packaged as a **sealed Docker runtime** for easy distribution and deployment.

This project focused not just on writing code, but on shipping a **reliable, reusable product end-to-end**.

---

## Problem

In automation-heavy environments, PDF generation is a common requirement (invoices, reports, confirmations, internal documents). However, existing options often introduce trade-offs:

- External PDF SaaS tools add recurring costs and latency  
- SaaS APIs can be unreliable or rate-limited  
- Many tools don’t integrate cleanly into automation platforms like n8n  
- Self-built scripts often lack security, documentation, or portability  

I wanted a solution that was:

- Fully self-hosted  
- Easy to integrate into automation workflows  
- Secure by default  
- Simple for others to deploy without exposing internal code  

---

## Solution

I built a **Docker-based HTML → PDF microservice** with the following characteristics:

- Accepts raw HTML via HTTP POST  
- Returns a generated PDF as a binary response  
- Secured using API key authentication  
- Runs entirely on private infrastructure  
- Distributed as a sealed Docker image (no source code exposure)  

The service is intentionally **tool-agnostic** and integrates cleanly with n8n, backend services, or scheduled jobs.

---

## Key Design Decisions

### 1. Self-hosted over SaaS  
I chose a self-hosted approach to remove vendor dependency, improve reliability, and give users full control over infrastructure and data.

### 2. Docker-first distribution  
Rather than asking users to install Node.js, browsers, or system dependencies, I packaged everything into a Docker image. This ensures:

- Predictable runtime behavior  
- Fast setup (minutes, not hours)  
- Clear separation between what users can configure and what stays internal  

### 3. Closed runtime, open documentation  
Although the source code is not exposed, the service is fully documented:

- Clear API contracts  
- Environment-based configuration  
- Explicit start / stop / removal lifecycle  

This balances intellectual property protection with usability.

### 4. Automation-first API design  
The API was designed with automation tools in mind:

- Simple JSON payloads  
- Binary file responses  
- Easy handling in n8n’s HTTP Request node  
- Deterministic behavior (no hidden state)  

---

## Implementation Highlights

- Node.js–based HTTP service  
- Headless browser rendering for accurate PDF output  
- API key authentication middleware  
- Health check endpoint for monitoring  
- Docker image with all runtime dependencies bundled  
- Clear README documentation for GitHub and Docker Hub  

---

## Testing & Validation

To avoid “works on my machine” issues, I performed **clean-room testing**:

1. Built the Docker image locally  
2. Pushed it to Docker Hub  
3. Deleted the local image  
4. Pulled it back as a “new user”  
5. Ran the container and generated a PDF successfully  

This validated that the service works exactly as documented for anyone pulling the image.

---

## Outcome

- Fully functional, production-ready microservice  
- Verified Docker Hub distribution  
- Clear documentation for both portfolio and operational use  
- Successfully integrated with automation workflows  
- Reusable foundation for future microservices  

---

## Key Learnings

- Packaging is part of the product — not an afterthought  
- Documentation quality directly affects perceived reliability  
- Clean-room testing changes how you think about “done”  
- Closed-source services still require transparency and discipline  
- Shipping end-to-end is more valuable than building isolated features  

---

## What I’d Improve Next

- Add optional rate limiting  
- Support HTML templates via URLs  
- Introduce versioned API routes  
- Add optional IP allowlisting  
- Expose metrics for monitoring  

---

## Tech Stack (High Level)

- Node.js  
- Docker  
- Headless browser rendering  
- HTTP API with API key security  

---

## Why This Matters

This project demonstrates my ability to:

- Identify real infrastructure problems  
- Design pragmatic, automation-friendly solutions  
- Package and distribute services professionally  
- Think beyond code into deployment, security, and usability  
