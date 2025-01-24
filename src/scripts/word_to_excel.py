from docx import Document
import pandas as pd
import re

def is_bullet_point(paragraph):
    # Check for various bullet point indicators
    return (paragraph.text.strip().startswith('•') or 
            paragraph.text.strip().startswith('-') or 
            paragraph.style.name.startswith('List'))

def process_word_doc():
    # Read the Word document
    doc = Document('type-descriptions.docx')  # Place in project root
    
    # Prepare data for Excel
    data = []
    current_type = None
    current_section = None
    
    for paragraph in doc.paragraphs:
        text = paragraph.text.strip()
        if not text:
            continue
            
        # Check for type header
        type_match = re.match(r'#?\s*Type\s*\[(\d+)\]', text)
        if type_match:
            current_type = int(type_match.group(1))
            continue
            
        # Check for section header
        section_match = re.match(r'#?\s*##?\s*(.*)', text)
        if section_match:
            current_section = section_match.group(1).strip()
            continue
            
        if current_type and current_section:
            # Determine if it's a bullet point or paragraph
            if is_bullet_point(paragraph):
                # Clean up bullet point text
                content = re.sub(r'^[•\-]\s*', '', text)
                content_type = 'list'
            else:
                content = text
                content_type = 'paragraph'
                
            # Format content for HTML if needed
            if content_type == 'list':
                # Preserve any bold text with <strong> tags
                for run in paragraph.runs:
                    if run.bold:
                        content = content.replace(run.text, f'<strong>{run.text}</strong>')
            
            data.append({
                'Type Number': current_type,
                'Section Name': current_section,
                'Content Type': content_type,
                'Content': content
            })
    
    # Create DataFrame and save to Excel
    df = pd.DataFrame(data)
    df.to_excel('src/data/type-descriptions.xlsx', index=False)
    print("Excel file created successfully!")

if __name__ == "__main__":
    process_word_doc()