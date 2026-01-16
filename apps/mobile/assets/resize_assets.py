from PIL import Image
import os

# Paths
assets_dir = r'C:\Users\brook\source\repos\handled\apps\mobile\assets'
images_dir = os.path.join(assets_dir, 'images')

# Brand colors
CREAM_BG = (250, 249, 246)  # #FAF9F6

# Load source images
icon_src = Image.open(os.path.join(images_dir, 'icon.png')).convert('RGBA')
logo_stacked = Image.open(os.path.join(images_dir, 'logo-stacked.png')).convert('RGBA')

# 1. App Icon (1024x1024) - checkmark on cream background
icon_1024 = Image.new('RGBA', (1024, 1024), CREAM_BG + (255,))
# Scale icon to fit with padding
icon_resized = icon_src.resize((800, 800), Image.Resampling.LANCZOS)
# Center it
x = (1024 - 800) // 2
y = (1024 - 800) // 2
icon_1024.paste(icon_resized, (x, y), icon_resized)
icon_1024.convert('RGB').save(os.path.join(assets_dir, 'icon.png'), 'PNG')
print('Created icon.png (1024x1024)')

# 2. Adaptive Icon for Android (1024x1024) - same as icon
icon_1024.convert('RGB').save(os.path.join(assets_dir, 'adaptive-icon.png'), 'PNG')
print('Created adaptive-icon.png (1024x1024)')

# 3. Favicon (48x48)
favicon = icon_1024.resize((48, 48), Image.Resampling.LANCZOS)
favicon.convert('RGB').save(os.path.join(assets_dir, 'favicon.png'), 'PNG')
print('Created favicon.png (48x48)')

# 4. Splash screen (1284x2778) - stacked logo centered on cream
splash = Image.new('RGBA', (1284, 2778), CREAM_BG + (255,))
# Scale stacked logo to reasonable size for splash
logo_height = 400
logo_ratio = logo_stacked.size[0] / logo_stacked.size[1]
logo_width = int(logo_height * logo_ratio)
logo_resized = logo_stacked.resize((logo_width, logo_height), Image.Resampling.LANCZOS)
# Center it
x = (1284 - logo_width) // 2
y = (2778 - logo_height) // 2
splash.paste(logo_resized, (x, y), logo_resized)
splash.convert('RGB').save(os.path.join(assets_dir, 'splash.png'), 'PNG')
print('Created splash.png (1284x2778)')

print('')
print('All assets generated!')
