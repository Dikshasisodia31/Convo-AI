# CONVO AI 🚀

> **Turn project conversations into actionable insights.**

Convo AI is an AI-powered project communication assistant . It analyzes project conversations and meeting recordings and converts them into structured, actionable information for teams.

## ✨ Features

- 📝 Analyze pasted project conversations
- 🎙️ Analyze meeting audio recordings
- 🤖 Gemini-powered AI analysis
- 📄 Generate concise summaries
- ✅ Extract actionable tasks
- 👤 Identify task owners
- 📅 Identify deadlines when mentioned
- 🚧 Detect blockers and problems
- 🧠 Extract important decisions
- 📜 Generate transcripts for audio meetings
- 💾 Store AI-generated insights in MongoDB
- 🧹 Delete temporary uploaded audio after processing

## 🏗️ Architecture

```text
React Client
     ↓
Node + Express API
     ↓
Gemini AI ─────→ Transcript + AI Insights
     ↓
MongoDB ←──────── Summary / Tasks / Blockers / Decisions
```

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Multer
- `@google/genai`

### AI
- Google Gemini

## 📁 Project Structure

```text
projectpulse-ai/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── conversationController.js
│   ├── models/
│   │   └── Conversation.js
│   ├── routes/
│   │   └── conversationRoutes.js
│   ├── services/
│   │   └── geminiService.js
│   ├── uploads/
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── README.md
```

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone <https://github.com/Dikshasisodia31/Convo-AI.git>
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

In another terminal:

```bash
cd server
npm install
```

### 4. Configure environment variables

Create:

```text
server/.env
```

Add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

Never commit `.env` or expose your API key.

### 5. Start the backend

```bash
cd server
npm run dev
```

Backend:

```text
http://localhost:5000
```

### 6. Start the frontend

```bash
cd client
npm run dev
```

Frontend:

```text
http://localhost:5173
```

### Audio

The audio route accepts a meeting recording, temporarily processes it, sends it to Gemini, stores the resulting analysis, and removes the temporary file.

The exact audio endpoint depends on the route configured in the backend.

## 🧠 AI Output

Example:

```json
{
  "transcript": "...",
  "summary": "The team discussed the payment API and checkout work.",
  "tasks": [
    {
      "task": "Complete payment API",
      "assignedTo": "Rahul",
      "deadline": "Friday"
    }
  ],
  "blockers": [
    "Checkout page is waiting for payment API credentials."
  ],
  "decisions": [
    "Payment API should be ready before Friday."
  ]
}
```

The AI instructions explicitly tell Gemini not to invent people, tasks, deadlines, blockers, or decisions when they are not present in the source.

## 🧪 Example Conversation

```text
Aman: The login API is complete.

Rahul: I will complete the payment API by Friday.

Priya: I cannot start the checkout page because we are waiting for the payment API credentials.

Manager: Rahul, please make sure the payment API is ready before Friday.
```

ProjectPulse AI can identify:

- The login API is complete.
- Rahul is responsible for the payment API.
- The payment API deadline is Friday.
- Priya's checkout work is blocked by missing payment API credentials.
- The manager emphasized the Friday requirement.

## 🚀 Future Improvements

- 🔎 Search across project conversations
- 💬 Ask Your Project AI assistant
- 🔗 Slack/Teams integration
- 📧 Email integration
- 📊 Project analytics
- 👥 Authentication and team workspaces
- ☁️ Cloud object storage for optional audio retention
- 🔔 Task/deadline notifications
- 📱 Improved mobile experience
