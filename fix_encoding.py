#!/usr/bin/env python3
import re

file_path = r"c:\Users\Akshad\Projects\reellog\src\App.jsx"

with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
    content = f.read()

# Fix arrow text in buttons
content = content.replace('See all →', 'See all <Icon name="right" size={14} style={{marginLeft: 4, display: "inline-flex"}} />')
content = content.replace('See all â†'', 'See all <Icon name="right" size={14} style={{marginLeft: 4, display: "inline-flex"}} />')

# Fix all broken arrow characters
# Left arrow
content = re.sub(r'â€¹', '<Icon name="left" size={14} />', content)
# Right arrow  
content = re.sub(r'â€º', '<Icon name="right" size={14} />', content)
# Alternative arrow pattern
content = re.sub(r'< Button.*?â€¹.*?</button>', '<button><Icon name="left" size={14} /></button>', content)

# Fix broken section dividers
content = re.sub(r'â"€+', '---', content)

# Fix other broken characters
content = content.replace('â€™', "'")
content = content.replace('â€˜', "'")
content = content.replace('â€"', '--')
content = content.replace('â–¶', '▶')
content = content.replace('âœ"', '✓')
content = content.replace('â—Ž', '•')
content = content.replace('â€¦', '...')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
    
print("Successfully fixed encoding issues and replaced arrows with Icon components!")
