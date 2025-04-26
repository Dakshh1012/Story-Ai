import requests
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
import textwrap
from fpdf import FPDF
import os

# Hardcoded API Key
API_KEY = "sk-32v2sBaxH6KZvRJDPvpyuKWcaw9iJfrwhUQpoMzEMm3GG8YR"

def generate_comic(prompt: str, dialogue_text: str, output_path: str = "./comic_output.webp"):
    """
    Generate a clean comic image with right-aligned white dialogue box
    
    Args:
        prompt (str): Image generation prompt
        dialogue_text (str): Dialogue text (use \n for new lines)
        output_path (str): Output file path
    """
    # Generate image (768x768)
    response = requests.post(
        "https://api.stability.ai/v2beta/stable-image/generate/core",
        headers={"authorization": f"Bearer {API_KEY}", "accept": "image/*"},
        files={"none": ''},
        data={
            "prompt": f"{prompt}, clean comic style",
            "output_format": "webp",
            "height": 768,
            "width": 768,
        },
    )

    if response.status_code != 200:
        raise Exception(f"API Error: {response.json()}")

    try:
        img = Image.open(BytesIO(response.content)).convert("RGBA")
        draw = ImageDraw.Draw(img)
        
        # Comic settings
        font_size = 42
        padding = 30
        outline_width = 3
        right_margin = 60
        max_bubble_width = 500  # Maximum width for the speech bubble
        line_spacing = 10

        # Font loading
        try:
            font = ImageFont.truetype("arial.ttf", font_size)
        except:
            try:
                font = ImageFont.truetype("helvetica.ttf", font_size)
            except:
                font = ImageFont.load_default()
                font.size = font_size

        # Calculate average character width
        avg_char_width = font.getlength("A")  # Approximate width of a character
        chars_per_line = int(max_bubble_width / avg_char_width)

        # Wrap text to fit within the maximum bubble width
        wrapped_lines = []
        for line in dialogue_text.split('\n'):
            wrapped_lines.extend(textwrap.wrap(line, width=chars_per_line))
        wrapped_text = '\n'.join(wrapped_lines)

        # Calculate text box dimensions
        bbox = draw.multiline_textbbox((0, 0), wrapped_text, font=font, spacing=line_spacing)
        bubble_width = min((bbox[2] - bbox[0]) + padding * 2, max_bubble_width)
        bubble_height = (bbox[3] - bbox[1]) + padding * 2

        # Position box (right-aligned)
        bubble_x1 = img.width - bubble_width - right_margin
        bubble_y1 = 40
        bubble_x2 = bubble_x1 + bubble_width
        bubble_y2 = bubble_y1 + bubble_height
        
        # Draw white box with more comic-like proportions
        draw.rounded_rectangle(
            [bubble_x1, bubble_y1, bubble_x2, bubble_y2],
            radius=20,  # More rounded corners for comic effect
            fill="white",
            outline="black",
            width=outline_width
        )
        
        # Add comic-style tail pointing left
        tail_points = [
            (bubble_x1 + 40, bubble_y2),
            (bubble_x1 - 30, bubble_y2 + 50),
            (bubble_x1 + 100, bubble_y2)
        ]
        draw.polygon(tail_points, fill="white", outline="black", width=outline_width)

        # Add text with comic-style formatting
        draw.multiline_text(
            (bubble_x1 + padding, bubble_y1 + padding),
            wrapped_text,
            font=font,
            fill="black",
            spacing=line_spacing,
            align="left"
        )

        img.save(output_path, format="WEBP", quality=90)
        print(f"✓ Comic saved: {output_path}")
        return output_path

    except Exception as e:
        raise Exception(f"Error: {str(e)}")

def create_comic_pdf(image_paths: list, output_pdf: str = "comic.pdf"):
    """Create a PDF from multiple comic panels"""
    pdf = FPDF(unit="pt", format=[768, 768])  # Same size as our images
    
    for image_path in image_paths:
        # Add a page for each image
        pdf.add_page()
        
        # Convert WEBP to temporary PNG for PDF compatibility
        with Image.open(image_path) as img:
            temp_png = image_path.replace(".webp", "_temp.png")
            img.save(temp_png, "PNG")
            
            # Add image to PDF (full page)
            pdf.image(temp_png, 0, 0, 768, 768)
            
            # Remove temporary PNG
            os.remove(temp_png)
    
    pdf.output(output_pdf)
    print(f"✓ PDF created: {output_pdf}")

def generate_story_comics(story: str, title: str, output_dir: str = "comics", panel_count: int = 10):
    try:
        # Setup directory
        os.makedirs(output_dir, exist_ok=True)
        
        # Generate script (using the previous functions you have)
        script = generate_comic_script(story, title, panel_count)
        
        # Save metadata
        with open(f"{output_dir}/script.json", "w") as f:
            json.dump(script, f, indent=2)
        
        # Generate panels and collect paths
        image_paths = []
        for idx, panel in enumerate(script[:panel_count]):
            output_path = f"{output_dir}/panel_{idx+1:02d}.webp"
            generate_comic(
                prompt=f"Dark fantasy vintage High-quality manga art style, Ghibli-inspired, soft colors, detailed backgrounds, {panel['image_prompt']}",
                dialogue_text=panel['teaching_text'],
                output_path=output_path
            )
            image_paths.append(output_path)
            time.sleep(1)  # API rate limiting
        
        # Create PDF
        create_comic_pdf(image_paths, f"{output_dir}/{title.replace(' ', '_')}.pdf")
            
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