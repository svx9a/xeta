import os

REPLACEMENTS = {
    'rgba(255,255,255,0.03)': 'rgba(0,0,0,0.03)',
    'rgba(255,255,255,0.05)': 'rgba(0,0,0,0.05)',
    'rgba(255,255,255,0.1)': 'rgba(0,0,0,0.1)',
    'rgba(255,255,255,0.2)': 'rgba(0,0,0,0.2)',
    'rgba(255,255,255,0.3)': 'rgba(0,0,0,0.3)',
    'rgba(255,255,255,0.4)': 'rgba(0,0,0,0.4)',
    '#0A1929': '#ffffff',
    '#fff': '#1e293b',
    '#ffffff': '#ffffff' # keep
}

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    original = content
    for old, new in REPLACEMENTS.items():
        # Avoid double replacing #ffffff -> #1e293b by being careful
        if old == '#fff':
            content = content.replace("color: '#fff'", "color: '#1e293b'")
            content = content.replace('text-white', 'text-slate-800')
        elif old == '#0A1929':
            content = content.replace("'#0A1929'", "'#ffffff'")
            content = content.replace("text-[#0A1929]", "text-slate-800")
            content = content.replace("bg-[#0A1929]", "bg-white")
            content = content.replace("border-[#0A1929]", "border-white")
        elif old.startswith('rgba(255'):
            content = content.replace(old, new)

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")

def main():
    for root, dirs, files in os.walk('src'):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                if file not in ['LoginPage.tsx']:
                    process_file(os.path.join(root, file))

if __name__ == '__main__':
    main()
