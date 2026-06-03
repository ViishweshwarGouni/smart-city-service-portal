def detect_fraud(
    description
):


    fraud_words=[

        "fake",
        "test",
        "asdf",
        "random"

    ]


    text=description.lower()


    for word in fraud_words:

        if word in text:

            return 80


    return 5