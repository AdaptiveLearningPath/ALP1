import torch
import torch.nn as nn

class AdaptiveTransformer(nn.Module):
    def __init__(self, input_dim=6, embed_dim=32, num_heads=2, hidden_dim=64, output_dim=5, num_classes=3):
        super(AdaptiveTransformer, self).__init__()

        # Project input features to embedding space
        self.input_fc = nn.Linear(input_dim, embed_dim)

        # Transformer Encoder Layers
        encoder_layer = nn.TransformerEncoderLayer(
            d_model=embed_dim,
            nhead=num_heads,
            dim_feedforward=hidden_dim,
            activation='relu',
            batch_first=True
        )
        self.transformer_encoder = nn.TransformerEncoder(encoder_layer, num_layers=2)

        # Final output layer: 5 questions × 3 classes each
        self.output_fc = nn.Linear(embed_dim, output_dim * num_classes)

        # Save output shape for reshaping
        self.output_dim = output_dim
        self.num_classes = num_classes

    def forward(self, x):
        # x: (batch_size, input_dim)
        x = x.unsqueeze(1)  # -> (batch_size, seq_len=1, input_dim)
        x = self.input_fc(x)  # -> (batch_size, 1, embed_dim)
        x = self.transformer_encoder(x)  # -> (batch_size, 1, embed_dim)
        x = x.squeeze(1)  # -> (batch_size, embed_dim)
        out = self.output_fc(x)  # -> (batch_size, 15)
        out = out.view(-1, self.output_dim, self.num_classes)  # -> (batch_size, 5, 3)
        return out
