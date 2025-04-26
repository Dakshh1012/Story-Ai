import os
import glob
from PIL import Image
import importlib.util

# Check if img2pdf is available, otherwise we'll use PIL directly
img2pdf_available = importlib.util.find_spec("img2pdf") is not None
if img2pdf_available:
    import img2pdf

def convert_comic_to_pdf(comic_directory="comic", output_filename="comic_book.pdf"):
    """
    Convert all images in the specified comic directory into a single PDF file.
    
    Args:
        comic_directory (str): Path to the directory containing comic images
        output_filename (str): Name for the output PDF file
    
    Returns:
        str: Path to the created PDF file
    """
    try:
        # Make sure the directory exists
        if not os.path.exists(comic_directory):
            raise FileNotFoundError(f"Comic directory '{comic_directory}' not found")
        
        # Get all image files and sort them numerically
        image_files = []
        # Add webp to supported image formats
        for ext in ['*.jpg', '*.jpeg', '*.png', '*.webp']:
            image_files.extend(glob.glob(os.path.join(comic_directory, ext)))
        
        if not image_files:
            raise ValueError(f"No image files found in '{comic_directory}'. Supported formats: jpg, jpeg, png, webp")
        
        print(f"Found {len(image_files)} images to convert")
        
        # Sort files numerically (assuming filenames like page1.jpg, page2.jpg etc.)
        image_files.sort(key=lambda x: int(''.join(filter(str.isdigit, os.path.basename(x))) or '0'))
        
        # For WebP images with img2pdf, we need to convert them to PNG first
        if img2pdf_available:
            has_webp = any(img.lower().endswith('.webp') for img in image_files)
            if has_webp:
                print("WebP images detected. Converting to PNG format for PDF compatibility...")
                converted_images = []
                temp_dir = os.path.join(os.path.dirname(comic_directory), "temp_images")
                os.makedirs(temp_dir, exist_ok=True)
                
                for i, img_path in enumerate(image_files):
                    if img_path.lower().endswith('.webp'):
                        img = Image.open(img_path)
                        png_path = os.path.join(temp_dir, f"page{i:03d}.png")
                        img.save(png_path, "PNG")
                        converted_images.append(png_path)
                    else:
                        converted_images.append(img_path)
                
                # Use converted images
                image_files = converted_images
                
            # Convert all images to PDF using img2pdf
            with open(output_filename, "wb") as f:
                f.write(img2pdf.convert(image_files))
        else:
            # Fallback to using PIL if img2pdf is not available
            convert_with_pil(image_files, output_filename)
        
        print(f"Successfully created PDF: {output_filename}")
        return output_filename
    
    except Exception as e:
        print(f"Error converting comic to PDF: {str(e)}")
        raise

def convert_with_pil(image_files, output_filename):
    """Use PIL to create a PDF from images when img2pdf is not available."""
    if not image_files:
        raise ValueError("No image files provided")
        
    first_image = Image.open(image_files[0])
    images = []
    
    # Open all images except the first one
    for img_path in image_files[1:]:
        img = Image.open(img_path)
        # Convert to RGB if needed (necessary for WebP with transparency)
        if img.mode == 'RGBA' or img.mode == 'P':
            img = img.convert('RGB')
        images.append(img)
    
    # Convert first image to RGB if needed
    if first_image.mode == 'RGBA' or first_image.mode == 'P':
        first_image = first_image.convert('RGB')
    
    # Save as PDF
    first_image.save(
        output_filename,
        save_all=True,
        append_images=images,
        format="PDF"
    )
    return output_filename

# Alternative implementation using reportlab if available
def convert_comic_to_pdf_with_reportlab(comic_directory="comic", output_filename="comic_book.pdf"):
    """
    Alternative version using reportlab instead of img2pdf
    """
    try:
        # Check if reportlab is installed
        reportlab_spec = importlib.util.find_spec("reportlab")
        if reportlab_spec is None:
            raise ImportError("The reportlab module is not installed. Install it with 'pip install reportlab'")
        
        from reportlab.pdfgen import canvas
        from reportlab.lib.pagesizes import letter
        
        if not os.path.exists(comic_directory):
            raise FileNotFoundError(f"Comic directory '{comic_directory}' not found")
        
        # Get all image files and sort them
        image_files = []
        for ext in ['*.jpg', '*.jpeg', '*.png']:
            image_files.extend(glob.glob(os.path.join(comic_directory, ext)))
        
        image_files.sort(key=lambda x: int(''.join(filter(str.isdigit, os.path.basename(x))) or '0'))
        
        if not image_files:
            raise ValueError(f"No image files found in '{comic_directory}'")
        
        print(f"Found {len(image_files)} images to convert")
        
        # Create a new PDF with Reportlab
        c = canvas.Canvas(output_filename, pagesize=letter)
        
        for img_path in image_files:
            img = Image.open(img_path)
            width, height = img.size
            
            # Add a page for each image
            c.setPageSize((width, height))
            c.drawImage(img_path, 0, 0, width, height)
            c.showPage()
        
        c.save()
        print(f"Successfully created PDF: {output_filename}")
        return output_filename
    
    except ImportError as ie:
        print(f"Reportlab not available: {str(ie)}")
        raise
    except Exception as e:
        print(f"Error converting comic to PDF: {str(e)}")
        raise

if __name__ == "__main__":
    # Run the conversion when the script is executed directly
    try:
        # Print directory information to help troubleshoot
        script_dir = os.path.dirname(os.path.abspath(__file__))
        comic_dir = os.path.join(script_dir, "comic")
        print(f"Looking for images in: {comic_dir}")
        
        # Check if directory exists
        if not os.path.exists(comic_dir):
            print(f"Comic directory not found. Creating it at: {comic_dir}")
            os.makedirs(comic_dir)
            print("Please place your WebP or other image files in this directory.")
            exit(1)
            
        # List files in the directory
        files = os.listdir(comic_dir)
        print(f"Files found in comic directory: {files}")
        
        pdf_path = convert_comic_to_pdf()
        print(f"PDF created at: {os.path.abspath(pdf_path)}")
    except Exception as e:
        print(f"Failed to create PDF: {str(e)}")
        # Try the alternative method if the first one fails
        try:
            pdf_path = convert_comic_to_pdf_with_reportlab()
            print(f"PDF created using alternative method at: {os.path.abspath(pdf_path)}")
        except Exception as e2:
            print(f"Alternative method also failed: {str(e2)}")
            print("Installing required packages...")
            print("Please run: pip install img2pdf Pillow reportlab")
