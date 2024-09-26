let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let audioBlob;

const recordButton = document.getElementById('recordButton');
const recordingIndicator = document.getElementById('recordingIndicator');
const fileUpload = document.getElementById('fileUpload');
const processButton = document.getElementById('processButton');
const uploadForm = document.getElementById('uploadForm');
const loading = document.getElementById('loading');
const transcriptionTextarea = document.getElementById('transcription');
const summaryTextarea = document.getElementById('summary');
const errorDiv = document.getElementById('error');

recordButton.addEventListener('click', toggleRecording);
fileUpload.addEventListener('change', handleFileUpload);
processButton.addEventListener('click', processAudio);

async function toggleRecording() {
    if (!isRecording) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            startRecording(stream);
        } catch (err) {
            showError("Error accessing microphone. Please ensure you have given permission.");
        }
    } else {
        stopRecording();
    }
}

function startRecording(stream) {
    audioChunks = [];
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
    
    mediaRecorder.addEventListener('dataavailable', event => {
        audioChunks.push(event.data);
    });

    mediaRecorder.addEventListener('stop', () => {
        audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        processButton.disabled = false;
    });

    mediaRecorder.start();
    isRecording = true;
    recordButton.innerHTML = '<i class="fas fa-stop"></i> Stop Recording';
    recordButton.classList.add('recording');
    recordingIndicator.style.display = 'block';
}

function stopRecording() {
    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach(track => track.stop());
    isRecording = false;
    recordButton.innerHTML = '<i class="fas fa-microphone"></i> Start Recording';
    recordButton.classList.remove('recording');
    recordingIndicator.style.display = 'none';
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        audioBlob = file;
        processButton.disabled = false;
    }
}

async function processAudio() {
    if (!audioBlob) {
        showError("No audio to process. Please record or upload an audio file.");
        return;
    }

    loading.style.display = 'block';
    processButton.disabled = true;

    const formData = new FormData(uploadForm);
    
    if (audioBlob instanceof Blob) {
        // Convert to WAV if it's a recorded audio
        if (audioBlob.type === 'audio/webm') {
            try {
                const wavBlob = await convertToWav(audioBlob);
                formData.set('audio', wavBlob, 'recorded_audio.wav');
            } catch (error) {
                showError("Error converting audio. Please try again.");
                loading.style.display = 'none';
                processButton.disabled = false;
                return;
            }
        } else {
            formData.set('audio', audioBlob, 'recorded_audio.wav');
        }
    }

    try {
        const response = await fetch('/', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Server error');
        }

        const result = await response.text();
        document.body.innerHTML = result;
        
        // Reattach event listeners to new DOM elements
        attachEventListeners();
    } catch (error) {
        showError("Error processing audio. Please try again.");
    } finally {
        loading.style.display = 'none';
        processButton.disabled = false;
    }
}

async function convertToWav(blob) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    const wavBuffer = audioBufferToWav(audioBuffer);
    return new Blob([wavBuffer], { type: 'audio/wav' });
}

function audioBufferToWav(buffer, opt) {
    opt = opt || {};

    var numChannels = buffer.numberOfChannels;
    var sampleRate = buffer.sampleRate;
    var format = opt.float32 ? 3 : 1;
    var bitDepth = format === 3 ? 32 : 16;

    var result;
    if (numChannels === 2) {
        result = interleave(buffer.getChannelData(0), buffer.getChannelData(1));
    } else {
        result = buffer.getChannelData(0);
    }

    return encodeWAV(result, format, sampleRate, numChannels, bitDepth);
}

function encodeWAV(samples, format, sampleRate, numChannels, bitDepth) {
    var bytesPerSample = bitDepth / 8;
    var blockAlign = numChannels * bytesPerSample;

    var buffer = new ArrayBuffer(44 + samples.length * bytesPerSample);
    var view = new DataView(buffer);

    /* RIFF identifier */
    writeString(view, 0, 'RIFF');
    /* RIFF chunk length */
    view.setUint32(4, 36 + samples.length * bytesPerSample, true);
    /* RIFF type */
    writeString(view, 8, 'WAVE');
    /* format chunk identifier */
    writeString(view, 12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, format, true);
    /* channel count */
    view.setUint16(22, numChannels, true);
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, sampleRate * blockAlign, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, blockAlign, true);
    /* bits per sample */
    view.setUint16(34, bitDepth, true);
    /* data chunk identifier */
    writeString(view, 36, 'data');
    /* data chunk length */
    view.setUint32(40, samples.length * bytesPerSample, true);
    if (format === 1) { // Raw PCM
        floatTo16BitPCM(view, 44, samples);
    } else {
        writeFloat32(view, 44, samples);
    }

    return buffer;
}

function interleave(inputL, inputR) {
    var length = inputL.length + inputR.length;
    var result = new Float32Array(length);

    var index = 0;
    var inputIndex = 0;

    while (index < length) {
        result[index++] = inputL[inputIndex];
        result[index++] = inputR[inputIndex];
        inputIndex++;
    }
    return result;
}

function writeFloat32(output, offset, input) {
    for (var i = 0; i < input.length; i++, offset += 4) {
        output.setFloat32(offset, input[i], true);
    }
}

function floatTo16BitPCM(output, offset, input) {
    for (var i = 0; i < input.length; i++, offset += 2) {
        var s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
}

function writeString(view, offset, string) {
    for (var i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

function attachEventListeners() {
    // Reattach event listeners after DOM update
    document.getElementById('recordButton').addEventListener('click', toggleRecording);
    document.getElementById('fileUpload').addEventListener('change', handleFileUpload);
    document.getElementById('processButton').addEventListener('click', processAudio);
}

// Initial attachment of event listeners
attachEventListeners();