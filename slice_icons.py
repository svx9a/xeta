import os
import math
from PIL import Image

def blend_alpha(item):
    r, g, b, a = item
    if a == 0:
        return item
    
    # Calculate brightness
    brightness = (r + g + b) / 3.0
    
    if brightness > 250:
        return (255, 255, 255, 0)
    elif brightness > 200:
        # smooth transition to transparent for anti-aliased white edges
        alpha = int(max(0, 255 - ((brightness - 200) * (255.0 / 50.0))))
        return (r, g, b, alpha)
    else:
        return item

def process_icons():
    img_path = "/Users/stevejohn/.gemini/antigravity/brain/a7c2393b-8d7c-47ae-8f63-4d01a33ade32/media__1773127240289.png"
    out_dir = "/Users/stevejohn/XETAPAY_DEV/src/assets/icons"
    os.makedirs(out_dir, exist_ok=True)
    
    print(f"Loading {img_path}")
    img = Image.open(img_path).convert("RGBA")
    
    print("Processing background...")
    data = img.getdata()
    new_data = [blend_alpha(item) for item in data]
    img.putdata(new_data)
    
    print("Cropping icons...")
    # Rough bounding boxes to isolate each icon
    # (left, top, right, bottom)
    boxes = [
        ('logo-cube', (20, 20, 310, 310)),
        ('logo-text', (310, 80, 670, 220)),
        ('phone',     (670, 20, 930, 330)),
    
        ('chart',     (20, 320, 300, 540)),
        ('card',      (310, 320, 580, 540)),
        ('eye',       (630, 320, 920, 540)),
    
        ('coin',      (20, 540, 290, 770)),
        ('globe',     (320, 540, 560, 770)),
        ('shield',    (660, 540, 890, 770)),
    
        ('clock',     (20, 750, 290, 1000)),
        ('refresh',   (320, 750, 600, 1000)),
        ('user',      (650, 750, 890, 1000)),
    ]
    
    for name, box in boxes:
        cropped = img.crop(box)
        
        # Auto-crop the transparent borders
        bbox = cropped.getbbox()
        if bbox:
            cropped = cropped.crop(bbox)
            
        out_path = os.path.join(out_dir, f"{name}.png")
        cropped.save(out_path, "PNG")
        print(f"Saved {out_path}")

if __name__ == '__main__':
    process_icons()
