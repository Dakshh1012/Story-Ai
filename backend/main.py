from flask import Flask, request, jsonify
import json
from questions import setup_murder_mystery_qa

app = Flask(__name__)

# Load the records.json file
with open('records.json', 'r') as f:
    records = json.load(f)

# Replace with your actual Groq API key
api_key = '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'

# Set up the QA system
qa_system = setup_murder_mystery_qa(api_key, records)

@app.route('/ask_question', methods=['POST'])
def ask_question():
    """
    Route to answer a question based on the murder mystery knowledge.
    The question should be sent in the JSON body like: {"question": "your question here"}
    """
    data = request.get_json()

    if 'question' not in data:
        return jsonify({"error": "No question provided"}), 400

    question = data['question']
    answer = qa_system(question)

    return jsonify({"question": question, "answer": answer})

if __name__ == '__main__':
    app.run(debug=True,port=5001)
