import requests
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
import textwrap
from fpdf import FPDF
import os

# Hardcoded API Key
API_KEY = "sk-jIiYohdndz1KbyySA3ZjUKB1TDnZGINADvCQcdXS0898dFot"

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
                prompt=f"Colorful minecraft style, clean line art, {panel['image_prompt']}",
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
        title="Milos_Mechanical_Adventure",
        output_dir="milos_adventure_comics",
        panel_count=10
    )