import pandas as pd
import pickle
import os

from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split

from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

from tensorflow.keras.models import Sequential

from tensorflow.keras.layers import (
    Embedding,
    Bidirectional,
    LSTM,
    Dense,
    Dropout
)


# ==========================
# Paths
# ==========================

DATA_PATH = "dataset/complaints.csv"

MODEL_DIR = "models"


os.makedirs(
    MODEL_DIR,
    exist_ok=True
)


# ==========================
# Load Dataset
# ==========================

df = pd.read_csv(DATA_PATH)


df = df[
    [
        "title",
        "description",
        "department"
    ]
]


df.dropna(inplace=True)



# ==========================
# Prepare Text
# ==========================

df["text"] = (
    df["title"].astype(str)
    +
    " "
    +
    df["description"].astype(str)
)



X = df["text"]

y = df["department"]



# ==========================
# Encode Departments
# ==========================

encoder = LabelEncoder()


y = encoder.fit_transform(y)



# ==========================
# Tokenizer
# ==========================

tokenizer = Tokenizer(
    num_words=10000,
    oov_token="<OOV>"
)


tokenizer.fit_on_texts(X)


sequences = tokenizer.texts_to_sequences(X)



X_pad = pad_sequences(
    sequences,
    maxlen=50
)


# ==========================
# Train Test Split
# ==========================

X_train, X_test, y_train, y_test = train_test_split(

    X_pad,
    y,

    test_size=0.2,

    random_state=42

)



# ==========================
# BiLSTM Model
# ==========================


model = Sequential(
[

Embedding(
    input_dim=10000,
    output_dim=128
),


Bidirectional(
    LSTM(64)
),


Dropout(
    0.3
),


Dense(
    64,
    activation="relu"
),


Dense(
    len(set(y)),
    activation="softmax"
)

]
)



model.compile(

    optimizer="adam",

    loss="sparse_categorical_crossentropy",

    metrics=[
        "accuracy"
    ]

)



# ==========================
# Train
# ==========================


model.fit(

    X_train,

    y_train,


    validation_data=(

        X_test,

        y_test
    ),


    epochs=10,


    batch_size=32

)



# ==========================
# Save Model
# ==========================


model.save(

    "models/bilstm_model.h5"

)



with open(
    "models/tokenizer.pkl",
    "wb"
) as f:

    pickle.dump(
        tokenizer,
        f
    )



with open(
    "models/label_encoder.pkl",
    "wb"
) as f:


    pickle.dump(
        encoder,
        f
    )



print("==========================")

print("BiLSTM training completed")

print("Files saved in models folder")

print("==========================")