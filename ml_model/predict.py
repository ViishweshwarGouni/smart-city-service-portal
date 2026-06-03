import os
import pickle
import numpy as np

from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences


BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)


MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "bilstm_model.h5"
)


TOKENIZER_PATH = os.path.join(
    BASE_DIR,
    "models",
    "tokenizer.pkl"
)


ENCODER_PATH = os.path.join(
    BASE_DIR,
    "models",
    "label_encoder.pkl"
)


# Load files

model = load_model(
    MODEL_PATH
)


with open(
    TOKENIZER_PATH,
    "rb"
) as f:

    tokenizer = pickle.load(f)



with open(
    ENCODER_PATH,
    "rb"
) as f:

    encoder = pickle.load(f)



def predict_department(
    title,
    description
):


    text = (
        title
        +
        " "
        +
        description
    )


    sequence = tokenizer.texts_to_sequences(
        [text]
    )


    padded = pad_sequences(
        sequence,
        maxlen=50
    )


    prediction = model.predict(
        padded
    )


    index = np.argmax(
        prediction
    )


    department = encoder.inverse_transform(
        [index]
    )[0]


    confidence = float(
        np.max(prediction)
    )


    return {
        "department": department,
        "confidence": confidence
    }