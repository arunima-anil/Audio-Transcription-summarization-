# Audio Transcription and Summarization System

## Overview
This project is an AI-driven web application designed to transcribe and summarize audio recordings from doctor-patient conversations. It utilizes the Whisper model for transcription and the BART model for summarization, providing users with easy-to-read summaries of their audio inputs.

## Features
- **Audio Upload**: Users can upload audio files for transcription and summarization.
- **Transcription**: Converts spoken language from audio files into text using the Whisper model.
- **Summarization**: Generates concise summaries of the transcriptions using the BART model.
- **User-Friendly Interface**: A simple and intuitive front end built with HTML and CSS

## Technologies Used
- **Backend**:
  - Python
  - Flask
  - Whisper (for transcription)
  - Hugging Face Transformers (for summarization)
  
- **Frontend**:
  - HTML
  - CSS

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/arunima-anil/Audio-Transcription-summarization-.git


## Running the Application
 1.Run the Backend Server: In one terminal, navigate to the project directory and run:
  ```bash
  python3 trans_summ.py
   ```
2.Run the Frontend Server: In a new terminal, navigate to the frontend directory and run:
```bash
  python3 app.py
```


