import os

REPLACEMENTS = {
    'bg-[#050C14]': 'bg-slate-50',
    'bg-[#050C14]/40': 'bg-slate-50',
    'bg-[#050C14]/60': 'bg-slate-50/80',
    'bg-[#0A1929]': 'bg-white',
    'bg-[#0A1929]/40': 'bg-white',
    'bg-[#0A1929]/50': 'bg-white',
    'bg-[#0A1929]/60': 'bg-white',
    'bg-[#0A1929]/80': 'bg-white/90',

    'text-white': 'text-slate-800',
    'text-white/20': 'text-slate-400',
    'text-white/30': 'text-slate-500',
    'text-white/40': 'text-slate-500',
    'text-white/50': 'text-slate-500',
    'text-white/60': 'text-slate-600',
    'text-white/80': 'text-slate-700',
    
    'border-white/5': 'border-slate-200',
    'border-white/10': 'border-slate-200',
    'border-white/20': 'border-slate-300',
    
    'bg-white/5': 'bg-slate-100',
    'bg-white/10': 'bg-slate-100',
    'bg-white/20': 'bg-slate-200',

    'text-[#4F8FC9]': 'text-blue-600',
    'text-[#4F8FC9]/80': 'text-blue-600/80',
    'text-[#4F8FC9]/60': 'text-blue-600/60',
    'bg-[#4F8FC9]': 'bg-blue-600',
    'bg-[#4F8FC9]/5': 'bg-blue-50',
    'bg-[#4F8FC9]/10': 'bg-blue-50',
    'bg-[#4F8FC9]/20': 'bg-blue-100',
    'border-[#4F8FC9]': 'border-blue-600',
    'border-[#4F8FC9]/20': 'border-blue-200',
    'border-[#4F8FC9]/30': 'border-blue-300',
    'border-[#4F8FC9]/40': 'border-blue-400',
    
    'shadow-[0_0_15px_#10B981]': 'shadow-sm',
    'shadow-[0_0_20px_#4F8FC9]': 'shadow-sm',
}

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    original = content
    for old, new in REPLACEMENTS.items():
        content = content.replace(old, new)

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")

def main():
    for root, dirs, files in os.walk('src'):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                if file not in ['LoginPage.tsx']: # Already manually styled
                    process_file(os.path.join(root, file))

if __name__ == '__main__':
    main()
