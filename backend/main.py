from flask import Flask, request, jsonify, send_file
import json
from questions import setup_murder_mystery_qa
from groq import Groq
import logging
from flask_cors import CORS
from tp import convert_comic_to_pdf
import os

app = Flask(__name__)
CORS(app)
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
generated_mystery_story = None

# Groq API setup (your actual API key)
api_key = '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'
groq_client = Groq(api_key=api_key)

# Load the records.json file
with open('records.json', 'r') as f:
    records = json.load(f)

@app.route('/generate_mystery', methods=['GET'])
def generate_mystery():
    global generated_mystery_story
    try:
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
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1500
        )

        if not response.choices:
            raise ValueError("No response generated from the API")

        # Store the generated story globally
        generated_story = response.choices[0].message.content.strip()
        if generated_story.startswith('"') and generated_story.endswith('"'):
            generated_story = generated_story[1:-1]
        
        # Set the global variable for the story
        generated_mystery_story = generated_story

        return jsonify({
            "status": "success",
            "story": generated_mystery_story,
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

@app.route('/generate_superhero', methods=['GET'])
def generate_superhero():
    try:
        # Child-friendly prompt with simple vocabulary requirements
        prompt = """Create a fun superhero story for young children (ages 4-8) with these rules:
        
1. Main Characters:
- Super Sunny: A hero who controls sunlight
- Captain Cloud: Can make fluffy clouds appear
- Raindrop Girl: Makes gentle rain for plants

2. Must Include:
- A simple problem (like a dried-up garden)
- The heroes working together
- A happy ending
- At least 3 sound effects (like WHOOSH! or SPLASH!)

3. Writing Style:
- Very short sentences
- Words with 1-2 syllables mostly
- Lots of repetition
- No scary elements

4. Format:
- Each sentence on a new line

Story:"""

        # Send to Groq with child-friendly settings
        response = groq_client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {
                    "role": "user", 
                    "content": prompt,
                }
            ],
            temperature=0.9,  # Higher for more creativity
            max_tokens=300,
            stop=["Moral:", "10."]  # Stop conditions
        )

        if not response.choices:
            raise ValueError("No story generated")

        # Format the response for children
        story = response.choices[0].message.content
        simplified_story = "\n".join(
            line for line in story.split('\n') 
            if line.strip() and len(line.split()) <= 8
        )

        return jsonify({
            "status": "success",
            "story": simplified_story,
            "format": "child_friendly",
            "word_count": len(simplified_story.split())
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Couldn't make superhero story: {str(e)}",
            "child_friendly_error": "Oops! The story machine took a nap. Try again soon!"
        }), 500

# Add this new endpoint
@app.route('/convert_comic_to_pdf', methods=['GET'])
def create_comic_pdf():
    try:
        comic_directory = request.args.get('directory', 'comic')
        output_filename = request.args.get('output', 'comic_book.pdf')
        
        # Convert images to PDF
        pdf_path = convert_comic_to_pdf(comic_directory, output_filename)
        
        # Return the PDF file
        return send_file(
            pdf_path,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=os.path.basename(output_filename)
        )
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Failed to convert comic to PDF: {str(e)}"
        }), 500


@app.route('/modify_story', methods=['POST'])
def modify_story():
    global generated_mystery_story

    # Check if the mystery story has been generated
    if generated_mystery_story is None:
        return jsonify({
            "status": "error",
            "message": "No mystery story generated yet. Please generate a story first."
        }), 400

    # Get the user input (e.g., "A kills B" or "B kills A")
    data = request.get_json()
    if 'prompt' not in data:
        return jsonify({"error": "No prompt provided"}), 400

    user_prompt = data['prompt']

    try:
        # Formulate a new prompt for Groq, incorporating the user's request to modify the plot
        modified_prompt = f"""
        The following is a mystery story set in a grand estate:

        {generated_mystery_story}

        Modify the story according to the following prompt: "{user_prompt}"

        The story should reflect the new events while keeping the overall structure intact.
        Maintain a surprising yet logical outcome, keeping the classic mystery tone.
        """

        # Send the modified prompt to Groq to generate a new story
        response = groq_client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[{"role": "user", "content": modified_prompt}],
            temperature=0.7,
            max_tokens=1500
        )

        if not response.choices:
            raise ValueError("No response generated from the API")

        # Get and clean the modified story
        modified_story = response.choices[0].message.content.strip()

        # Return the output in the original format
        return jsonify({
            "status": "success",
            "story": modified_story,
            "elements_used": {
                "characters": ["A", "B"],  # Example of updated characters or details if needed
                "locations": ["Grand Estate"],
                "evidence": ["Clue 1", "Clue 2"]
            }
        })

    except Exception as e:
        logging.error(f"Error in modify_story: {str(e)}")
        return jsonify({
            "status": "error",
            "message": f"Failed to modify the story: {str(e)}"
        }), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)