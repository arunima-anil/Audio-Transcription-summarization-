from flask import Flask, request, render_template
import requests

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    transcription = None
    summary = None
    error = None

    if request.method == 'POST':
        audio_file = request.files.get('audio')

        if audio_file:
            # Send the audio file to the transcription and summarization service
            response = requests.post(
                "http://127.0.0.1:5001/process", 
                files={"audio": audio_file}
            )

            if response.status_code == 200:
                data = response.json()
                transcription = data.get("transcription")
                summary = data.get("summary")
            else:
                error = response.json().get("error", "An error occurred.")

    return render_template('index.html', transcription=transcription, summary=summary, error=error)

if __name__ == '__main__':
    app.run(port=5000, debug=True)
