from flask import Flask, request, jsonify
import json
from questions import setup_murder_mystery_qa
from groq import Groq
import logging
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

groq_client = Groq(
    api_key="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"
)

@app.route('/generate_mystery', methods=['GET'])
def generate_mystery():
    try:
        # Load the records data
        with open('records.json', 'r', encoding='utf-8') as f:
            records = json.load(f)
        
        # Extract characters and other entities
        characters = []
        locations = []
        evidence = []
        
        for record in records:
            node = record['n']
            labels = node['labels']
            name = node['properties']['name']
            
            if 'Person' in labels and not any(x in labels for x in ['Location', 'Evidence']):
                characters.append(name)
            elif 'Location' in labels:
                locations.append(name)
            elif 'Evidence' in labels:
                evidence.append(name)
        
        # Form the prompt
        prompt = f"""Create a murder mystery story set in a grand estate using the following elements:

Characters:
{', '.join(characters)}

Locations:
{', '.join(locations)}

Evidence/Clues:
{', '.join(evidence)}

Requirements:
1. The story must begin with a murder at a grand estate
2. Incorporate all characters naturally with distinct personalities
3. Use at least 3 key pieces of evidence
4. Include unexpected twists
5. Maintain a classic mystery tone
6. The solution should be surprising but logical
7. Keep the story between 500-800 words

Begin the story now:
"""

        # Send to Groq
        response = groq_client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {
                    "role": "user", 
                    "content": prompt,
                }
            ],
            temperature=0.7,
            max_tokens=1500
        )

        if not response.choices:
            raise ValueError("No response generated from the API")

        generated_story = response.choices[0].message.content
        
        # Clean up the response
        story = generated_story.strip()
        if story.startswith('"') and story.endswith('"'):
            story = story[1:-1]
        
        return jsonify({
            "status": "success",
            "story": story,
            "elements_used": {
                "characters": characters,
                "locations": locations,
                "evidence": evidence
            }
        })

    except Exception as e:
        logging.error(f"Error in generate_mystery: {str(e)}")
        return jsonify({
            "status": "error",
            "message": f"Failed to generate mystery: {str(e)}"
        }), 500
if __name__ == '__main__':
    app.run(debug=True,port=5001)
