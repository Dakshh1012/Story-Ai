import sys
print(sys.executable)

import os
import json
import time
import google.generativeai as genai
from typing import List, Dict
from generate_comic import generate_comic

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
                prompt=f"Dark fantasy vintage High-quality manga art style, Ghibli-inspired, soft colors, detailed backgrounds, {panel['image_prompt']}",
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
    It was a chilly autumn evening when Detective Emily Windsor arrived at Ravenwood Manor, the grand estate of the wealthy and reclusive Lady Victoria Waverley. The detective's sharp eyes scanned the opulent foyer, taking in the lavish furnishings and the eerie atmosphere that hung in the air like a shroud. She had been summoned to investigate a murder, and by the looks of it, it was going to be a case like no other.\n\nProfessor James Winter, a renowned expert in ancient rituals, stood beside Lady Victoria, his eyes red-rimmed from crying. \"Thank you for coming, Detective,\" he said, his voice trembling. \"We're in shock. Poor Mr. Blackstone... he was found dead in the gardens just an hour ago.\"\n\nDetective Windsor's gaze settled on the victim, Mr. Edward Blackstone, a middle-aged man with a stern expression frozen on his face. A torn piece of fabric was clutched in his hand, and a cryptic message was scrawled on the ground near his body: \"The lavender blooms in her room.\"\n\nAs the detective began to survey the crime scene, Captain Reginald Fanshawe, a decorated war hero, emerged from the shadows, his piercing blue eyes fixed on the body. \"I was in the library when I heard the shot,\" he said, his voice steady. \"I didn't see anything, but I heard footsteps fleeing towards the gardens.\"\n\nMrs. Vivienne LaRue, the manor's housekeeper, fluttered around the edge of the group, her eyes darting nervously between the detective and the body. \"I didn't see anything, Detective, but I did notice that Mr. Markham, the estate's manager, was acting strange earlier today. He seemed agitated and kept glancing at his pocket watch.\"\n\nDetective Windsor's ears perked up at the mention of Mr. Silas Markham, and she made a mental note to interview him further. She turned to Professor Thistlewaite, a gentle-looking man with a wild look in his eye. \"What can you tell me about the ritualistic aspects of this crime, Professor?\"\n\nThe professor's eyes lit up. \"Ah, yes! The torn fabric, the cryptic message... it's all connected to an ancient cult that worshipped the goddess of the harvest. They believed that the scent of lavender held mystical powers.\"\n\nDr. Sophia Patel, the estate's resident doctor, approached the group, her eyes somber. \"I've examined the body, Detective. The victim was shot at close range, and the killer was likely someone he trusted.\"\n\nAs the detective continued to investigate, she discovered a hidden room in Lady Victoria's chambers, filled with ancient artifacts and tomes. A small, ornate box on the dresser caught her eye, emitting a faint scent of lavender. Inside, she found a note that read: \"Meet me in the gardens at midnight. Come alone.\"\n\nThe game was afoot. Detective Windsor's mind raced with theories and suspects. Was it Mr. Markham, acting on a hidden agenda? Or perhaps Captain Fanshawe, seeking revenge for a past grievance? Or maybe, just maybe, it was Lady Victoria herself, using her wealth and influence to cover her tracks.\n\nAs the sun dipped below the horizon, Detective Windsor gathered the suspects in the grand ballroom. She revealed the torn fabric, the cryptic message, and the hidden room, her eyes locked on each face, searching for the telltale signs of guilt.\n\nAnd then, in a stunning twist, she revealed the killer: Professor James Winter. The soft-spoken professor had been using his knowledge of ancient rituals to cover his own tracks, using the torn fabric and cryptic message to mislead the investigation. The scent of lavender, it turned out, was a red herring, meant to distract from the true motive: a long-buried family secret that threatened to destroy Lady Victoria's reputation.\n\nAs the professor was led away in handcuffs, Detective Windsor couldn't help but feel a sense of satisfaction. It had been a complex case, full of twists and turns, but in the end, justice had been served. And as she left Ravenwood Manor, she couldn't help but wonder what other secrets the grand estate held, waiting to be uncovered.
    """
    
    generate_story_comics(
        story=sample_story,
        title="Murder at Ravenwood Manor",
        output_dir="comic",
        panel_count=10
    )