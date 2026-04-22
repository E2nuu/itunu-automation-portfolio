# 🧠 Omnichannel AI Scheduling Agent ("Tim")

An enterprise-grade, stateful AI scheduling assistant built to handle complex, real-world booking flows via chat.

🔗 **[Download the Core Agent Workflow JSON here](https://github.com/E2nuu/itunu-automation-portfolio/blob/main/n8n-workflows/AI%20Scheduler/Ai%20scheduler.json)**
🔗 **[Download the Background Worker JSON here](https://github.com/E2nuu/itunu-automation-portfolio/blob/main/n8n-workflows/AI%20Scheduler/follow-up%20roller.json)**

## 🏗️ System Overview
This is not a basic Q&A chatbot. "Tim" is a fully autonomous scheduling architecture designed to handle edge cases, process multimodal inputs, and strictly enforce database state without hallucinating availability.

The system is decoupled into three primary engines:
1. **The Cognitive Layer (Agent):** Handles natural language, memory, and intent parsing.
2. **The Execution Router:** A strict database operations handler that the Agent calls via HTTP tools to ensure secure, predictable Postgres interactions.
3. **The Background Worker:** An asynchronous cron job that polls and executes scheduled events (like follow-ups) without blocking the main conversational thread.

## ⚙️ Technical Architecture & Highlights

### 1. Multimodal Lead Intake
Users don't always type perfectly formatted requests. This intake pipeline handles diverse media types:
* **Audio Processing:** Uses OpenAI (Whisper) to transcribe voice notes on the fly.
* **Vision/Image Parsing:** Uses GPT-4o-mini to extract and read text from uploaded images (like screenshots of calendars).
* **Text Normalization:** Cleans and standardizes inputs before hitting the agent context window.

### 2. Decoupled Tool Routing (Security & Scale)
Instead of giving the LLM direct access to the database, the agent uses HTTP Request Tools (`get_availability`, `book_appointment`, etc.) to ping an internal `action-router` webhook. 
* A Switch node acts as the "Traffic Cop," mapping the agent's intent to precise Postgres queries.
* This prevents SQL injection risks and keeps the LLM from accidentally mutating the wrong tables.

### 3. Stateful Memory & Queue Management
* **Redis Integration:** Manages a strict 20-message memory buffer window per user session.
* **Queue Cleanup:** Utilizes a 10-second Schedule Trigger to sweep the Redis queues and ensure no user requests are dropped or hung during high-volume traffic spikes.

### 4. Asynchronous Scheduled Actions
To keep the main conversational webhook fast and stateless regarding time delays, future tasks are handled by a dedicated worker.
* **Cron Polling:** A 1-minute interval trigger sweeps the `follow_ups` Postgres table for pending tasks.
* **Self-Pinging Loop:** The worker packages the context and hits the primary agent's `/follow-up` webhook, pushing the reminder out to the user seamlessly.

### 5. Humanized UX Delivery
Bots that reply instantly with monolithic walls of text feel cheap. This workflow includes a "Humanization Pipeline":
* **Message Splitting:** Breaks long LLM outputs into native-feeling, bite-sized chat bubbles.
* **Dynamic Typing Delays:** Injects a randomized 0–5 second wait time between messages to simulate human typing cadence before pushing the payload to the Slack API.

## 🛠️ Tech Stack
* **Orchestration:** n8n (Self-hosted)
* **AI & Logic:** LangChain AI Agent, OpenAI Models (GPT-4o/Whisper)
* **State & DB:** Redis (Session Queues), PostgreSQL (Booking State)
* **Integrations:** Slack API
