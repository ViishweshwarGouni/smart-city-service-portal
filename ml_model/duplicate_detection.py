from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity



def check_duplicate(
    new_text,
    old_complaints
):


    if len(old_complaints)==0:
        return False


    documents = (
        old_complaints
        +
        [new_text]
    )


    vectorizer = TfidfVectorizer()


    matrix = vectorizer.fit_transform(
        documents
    )


    similarity = cosine_similarity(
        matrix[-1],
        matrix[:-1]
    )


    score = similarity.max()


    return score > 0.80