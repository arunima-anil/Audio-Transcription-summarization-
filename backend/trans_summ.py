from flask import Flask, request, jsonify
import whisper
from transformers import pipeline
import os

app = Flask(__name__)

# Load Whisper model for transcription
print("Loading Whisper model...")
transcription_model = whisper.load_model("base")
print("Whisper model loaded.")

# Load BART model for summarization
print("Loading summarization model...")
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
print("Summarization model loaded.")

@app.route('/process', methods=['POST'])
def process_audio():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files['audio']
    audio_path = "temp_audio.wav"
    audio_file.save(audio_path)

    # Transcription using Whisper
    result = transcription_model.transcribe(audio_path)
    transcription = result['text']
    print("Transcription completed.")

    # Summarization using BART
    summary = summarizer(transcription, max_length=100, min_length=30, do_sample=False)
    print("Summarization completed.")

    # Clean up temporary audio file
    os.remove(audio_path)

    return jsonify({
        "transcription": transcription,
        "summary": summary[0]['summary_text']
    }), 200


if __name__ == '__main__':
    app.run(port=5001, debug=True)
