from flask import Flask, request, render_template
import requests
import tempfile
import os

app = Flask(__name__)


@app.route("/", methods=["GET", "POST"])
def index():
    transcription = None
    summary = None
    error = None

    if request.method == "POST":
        audio_file = request.files.get("audio")

        if audio_file:
            # Create a temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
                audio_file.save(temp_file.name)
                temp_filename = temp_file.name

            try:
                # Send the audio file to the transcription and summarization service
                with open(temp_filename, "rb") as audio:
                    response = requests.post(
                        "http://127.0.0.1:5001/process",  # Adjust to your service URL
                        files={"audio": audio},
                    )

                if response.status_code == 200:
                    data = response.json()
                    transcription = data.get("transcription")
                    summary = data.get("summary")
                else:
                    error = response.json().get("error", "An error occurred.")
            finally:
                # Clean up the temporary file
                os.unlink(temp_filename)

    return render_template(
        "index.html", transcription=transcription, summary=summary, error=error
    )


if __name__ == "__main__":
    app.run(port=5000, debug=True)
