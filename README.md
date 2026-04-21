<div align="center">

# Audio Transcription & Summarization System

[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Whisper](https://img.shields.io/badge/OpenAI-Whisper-412991?style=for-the-badge&logo=openai&logoColor=white)](https://github.com/openai/whisper)
[![BART](https://img.shields.io/badge/HuggingFace-BART-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black)](https://huggingface.co)
[![JavaScript](https://img.shields.io/badge/Frontend-JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](.)
[![Domain](https://img.shields.io/badge/Domain-Healthcare_AI-22c55e?style=for-the-badge)](.)

> Transcribes doctor-patient conversations and generates clean clinical summaries - powered by Whisper + BART.

</div>

---

## Problem It Solves

Doctors spend hours manually writing visit notes. This app listens to the conversation, transcribes every word, and summarises it into a concise clinical note.

---

## How It Works

```
Audio File Upload
      |
      v
OpenAI Whisper (ASR)
  - Converts speech to text
  - Handles accents and medical terminology
      |
      v
BART Summarization (HuggingFace)
  - Extracts key medical information
  - Produces structured summary
      |
      v
Web Interface displays Transcript + Summary
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Speech-to-Text** | OpenAI Whisper |
| **Summarization** | HuggingFace BART (facebook/bart-large-cnn) |
| **Backend** | Python (FastAPI / Flask) |
| **Frontend** | HTML + CSS + JavaScript |

---

## Run Locally

```bash
git clone https://github.com/arunima-anil/Audio-Transcription-summarization-
cd Audio-Transcription-summarization-
pip install -r requirements.txt
python backend/app.py
# Open frontend/index.html in browser
```

---

<div align="center">Built as part of AI & Data Science portfolio | <a href="https://github.com/arunima-anil">@arunima-anil</a></div>
