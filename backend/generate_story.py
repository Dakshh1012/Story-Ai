import sys
from groq import Groq

def generate_murder_mystery_story(api_key: str, model: str = "llama3-70b-8192") -> str:
    """Generate a murder mystery story with Groq's LLM"""
    if not api_key or not isinstance(api_key, str):
        raise ValueError("Invalid API key provided")
    
    client = Groq(api_key=api_key)
    
    prompt = """Write a complete and a complicated  and long with a lot of characters make the story  such that it would make a very complicated graph database murder mystery short story with:
    - A creative, ominous title
    - 1920s aristocratic setting
    - 8+ suspects with hidden motives
    - Three subtle clues hidden in dialogue
    - A twist ending that's surprising but logical
    - Proper narrative formatting with paragraphs
    
    Example structure:
    [Title]
    [Setting description]
    [Character introductions]
    [The murder scene]
    [Investigation with clues]
    [Final revelation]"""
    
    try:
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model=model,
            temperature=0.7,
            max_tokens=3000,
            top_p=0.9
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error generating story: {str(e)}"


