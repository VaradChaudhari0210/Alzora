# 🧠 Alzora – Rebuilding Memories for Alzheimer's Patients

Alzora is an AI-powered mobile application that helps Alzheimer's patients reconnect with their memories by reconstructing them from photos, voice inputs, and conversational cues. It acts as a digital memory companion, providing emotional support and meaningful recall for patients and caregivers.

---

## 📱 Demo

> 🔗 [Coming Soon – Video Walkthrough or Screenshots]

---

## 🌟 Features

- 🖼️ **Memory Reconstruction from Images**  
  Detect faces and generate memory-style descriptions from uploaded photos using AI.

- 🔊 **Voice-to-Memory Conversion**  
  Converts audio recordings into meaningful textual memories.

- 💬 **AI Chatbot**  
  A friendly companion chatbot that recalls and narrates reconstructed memories upon user request.

- 🧠 **Structured Memory Timeline**  
  Stores memories grouped by people, events, places, and emotions.

- 🔐 **Secure Auth System**  
  JWT-based authentication with token blacklisting on logout to ensure secure memory access.

---

## 🧩 Tech Stack

| Layer        | Technology                                |
|--------------|--------------------------------------------|
| Mobile App   | React Native (Expo)                        |
| Backend API  | Node.js, Express.js                        |
| Database     | PostgreSQL + Prisma ORM                    |
| Auth         | JWT with Token Blacklisting in Database    |
| AI Services  | Python (DeepFace, Whisper, BLIP, HuggingFace Transformers) |
| Memory Store | JSON-based storage or PostgreSQL           |

---

## 🧠 AI Tools Used

| Task                    | Tool / Model                |
|-------------------------|-----------------------------|
| Face Recognition        | DeepFace                    |
| Image Captioning        | BLIP / BLIP-2               |
| Speech Transcription    | Whisper                     |
| Memory Summarization    | BART / T5 (Hugging Face)    |
| Entity Extraction       | spaCy                       |
| Chatbot (LLM)           | GPT-3.5 / Mistral / Phi-2    |

---

## 🛡️ Security

- All memory data is tied to authenticated users.
- Tokens are invalidated on logout via a `BlacklistedToken` table.
- Sensitive inputs (photos, audio) are securely processed and stored.

---

## 📂 Project Structure

📦 Alzora
├── backend
│ ├── prisma
│ ├── controllers
│ ├── routes
│ ├── middleware
│ ├── app.js
├── mobile
│ ├── screens
│ ├── components
│ ├── services
│ ├── App.js
├── ai-services
│ ├── captioning.py
│ ├── face_recognition.py
│ ├── speech_to_text.py
├── README.md


---

## 🚀 Getting Started

### Prerequisites

- Node.js
- PostgreSQL
- Python 3.8+
- Prisma CLI
- React Native CLI (or Expo)
- [Install Whisper & DeepFace](https://github.com/openai/whisper)

### Backend Setup

```bash
cd backend
npm install
npx prisma migrate dev --name init
npx prisma generate
npm start
```

### AI Services (Python)
```bash
cd ai-services
pip install -r requirements.txt
# Run microservices (e.g., Flask/FastAPI)
```

### Mobile App (Expo)
```bash
cd mobile
npm install
npx expo start
```

## License
This project is licensed under the MIT License - see the LICENSE file for details.
