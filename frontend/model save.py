import torch
import whisper  # Import the whisper module
from transformers import BartForConditionalGeneration

# Load your models
whisper_model = whisper.load_model("base")  # Load Whisper model
bart_model = BartForConditionalGeneration.from_pretrained("facebook/bart-large-cnn")  # Load BART model

# Save Whisper model
torch.save(whisper_model.state_dict(), "whisper_model.pt")  # Save model weights as .pt file

# Save BART model
torch.save(bart_model.state_dict(), "bart_model.pt")  # Save model weights as .pt file

print("Models saved successfully.")
