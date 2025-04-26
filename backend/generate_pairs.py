from typing import List, Dict, Tuple
import json
from groq import Groq

def extract_relationship_triples(story: str, api_key: str) -> List[Tuple[str, str, str]]:
    """
    Extracts only node-edge-node relationship triples from a story using Groq.
    Returns list of tuples: (source_node, relationship_type, target_node)
    """
    client = Groq(api_key=api_key)
    
    prompt = f"""
    Analyze this murder mystery story and extract ONLY direct relationship triples:
    
    {story}
    
    Return a JSON array where each element is a triple with:
    - "source": Source node name (exact name from story)
    - "relationship": Relationship type in UPPER_SNAKE_CASE
    - "target": Target node name (exact name from story)
    
    Include ALL important relationships between:
    - People and other people
    - People and objects/weapons
    - People and locations
    - Evidence and conclusions
    
    Example output:
    [
        ["Lady Whitmore", "HAS_MOTIVE", "Lord Blackwood"],
        ["Revolver", "USED_IN", "Library"]
    ]
    """
    
    try:
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama3-70b-8192",
            response_format={"type": "json_object"},
            temperature=0.2  # Low for consistent parsing
        )
        
        data = json.loads(response.choices[0].message.content)
        return [(triple["source"], triple["relationship"], triple["target"]) 
                for triple in data["triples"]]
    
    except Exception as e:
        print(f"Error extracting relationships: {str(e)}")
        return []