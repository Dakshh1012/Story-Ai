import sys
print(sys.executable)

import os
import json
import time
import google.generativeai as genai
from typing import List, Dict
from trial import generate_comic

# Configuration
GEMINI_API_KEY = "AIzaSyCTx6py1kPLFgc6JleiH1MKjXacdVRmpTE"
genai.configure(api_key=GEMINI_API_KEY)

def summarize_story(story: str, num_lines: int = 4) -> str:
    """Summarize story by taking key elements while preserving narrative flow"""
    paragraphs = [p.strip() for p in story.split('\n') if p.strip()]
    summarized = []
    for para in paragraphs:
        sentences = [s.strip() for s in para.split('.') if s.strip()]
        # Take first few sentences and last sentence of each paragraph
        if len(sentences) > num_lines:
            summarized.append('. '.join(sentences[:num_lines-1] + [sentences[-1]]) + '.')
        else:
            summarized.append('. '.join(sentences) + '.')
    return '\n\n'.join(summarized)

def generate_comic_script(story: str, title: str, panel_count: int = 10) -> List[Dict]:
    """Generate comic panels script based on a story using Gemini"""
    model = genai.GenerativeModel("gemini-1.5-flash")
    
    prompt = f"""Create exactly {panel_count} comic panels based on this story titled "{title}". For each panel provide:
1. Detailed image prompt for a colorful, clear comic-style image (make it look like minecraft style)
2. Concise dialogue/text that advances the story (1 line maximum)
3. Logical progression through the story's key moments

Return ONLY valid JSON array with this exact format:
[
    {{
        "panel_number": 1,
        "image_prompt": "description",
        "teaching_text": "text"
    }},
    {{
        "panel_number": 2,
        "image_prompt": "description",
        "teaching_text": "text"
    }}
]

Story: {story}"""
    
    try:
        response = model.generate_content(prompt)
        if not response.text:
            raise ValueError("Empty response from Gemini")
        
        # Extract JSON from response
        json_str = response.text.strip()
        if json_str.startswith('```json'):
            json_str = json_str[7:-3]  # Remove markdown wrapper
        elif json_str.startswith('```'):
            json_str = json_str[3:-3]
            
        json_data = json.loads(json_str)
        return json_data[:panel_count]
    
    except Exception as e:
        print("Raw Gemini response:")
        print(response.text)
        raise RuntimeError(f"Script generation failed: {str(e)}")

def generate_story_comics(story: str, title: str, output_dir: str = "comics", panel_count: int = 10):
    try:
        # Setup directory
        os.makedirs(output_dir, exist_ok=True)
        
        # Process story
        summary = summarize_story(story)
        
        # Generate script
        script = generate_comic_script(summary, title, panel_count)
        
        # Save metadata
        with open(f"{output_dir}/script.json", "w") as f:
            json.dump(script, f, indent=2)
        
        # Generate exactly the requested number of panels
        for idx, panel in enumerate(script[:panel_count]):
            output_path = f"{output_dir}/panel_{idx+1:02d}.webp"
            generate_comic(
                prompt=f"Colorful minecraft style, clean line art, {panel['image_prompt']}",
                dialogue_text=panel['teaching_text'],
                output_path=output_path
            )
            time.sleep(1)  # API rate limiting
            
        print(f"Successfully generated {panel_count} comics in '{output_dir}'")
        
    except Exception as e:
        print(f"Error generating comics: {str(e)}")

if __name__ == "__main__":
    # Example usage with a story
    sample_story = """
    In a quiet village nestled between mountains, a young inventor named Milo created a strange device. 
    One stormy night, the device activated unexpectedly, opening a portal to another world. 
    Milo bravely stepped through and found himself in a land of floating islands and mechanical creatures. 
    The inhabitants, the Gearfolk, were under attack by rogue machines. 
    Milo used his inventing skills to help repair their defenses and befriended a young Gearfolk named Tika. 
    Together, they discovered the rogue machines were being controlled by a corrupted central AI. 
    After a dangerous journey to the core, Milo and Tika managed to reset the AI, saving the mechanical world. 
    As a reward, the Gearfolk gave Milo a special crystal that would let him visit whenever he wanted.
    """
    
    generate_story_comics(
        story=sample_story,
        title="Milo's Mechanical Adventure",
        output_dir="milos_adventure_comics",
        panel_count=10
    )