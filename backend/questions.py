import json
from groq import Groq

def setup_murder_mystery_qa(api_key: str, records: list):
    """
    Creates a QA system using in-memory records (no file needed)

    Args:
        api_key: Groq API key
        records: List of Neo4j records (already loaded)
    """
    # Extract knowledge from records
    knowledge = {
        "people": set(),
        "locations": set(),
        "evidence": set()
    }
    
    for record in records:
        node = record.get('n', {})
        labels = node.get('labels', [])
        props = node.get('properties', {})
        name = props.get('name', '')

        if not name:
            continue
        
        # Check for the correct classification based on labels
        if 'Person' in labels and 'Location' not in labels and 'Evidence' not in labels:
            knowledge["people"].add(name)
        elif 'Location' in labels:
            knowledge["locations"].add(name)
        elif 'Evidence' in labels:
            knowledge["evidence"].add(name)

    # Convert sets to sorted lists for consistent output
    people = ', '.join(sorted(list(knowledge['people'])))
    locations = ', '.join(sorted(list(knowledge['locations'])))
    evidence = ', '.join(sorted(list(knowledge['evidence'])))

    # Create prompts
    system_prompt = f"""You're a detective analyzing a murder case with these facts:

    People: {people}
    Locations: {locations}
    Evidence: {evidence}

    Rules:
    1. Answer ONLY using these facts.
    2. For unknown info: respond with "That's not in the case files."
    3. Be concise and logical.
    """

    # Initialize Groq API client
    client = Groq(api_key=api_key)

    # Function to answer questions based on the extracted knowledge
    def answer(question: str) -> str:
        try:
            # Send question to Groq API for response
            response = client.chat.completions.create(
                messages=[{"role": "system", "content": system_prompt},
                          {"role": "user", "content": question}],
                model="llama3-70b-8192",
                temperature=0.3
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Error: {str(e)}"

    return answer

# Example usage:
# Assuming `records.json` contains the list of records in the desired format
with open('records.json', 'r') as f:
    records = json.load(f)

