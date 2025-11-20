"""
Simple script to convert HTML poster to PDF using xhtml2pdf
Works better on Windows than WeasyPrint
"""

import os
from pathlib import Path

def convert_with_xhtml2pdf(html_file, pdf_file):
    """Convert HTML to PDF using xhtml2pdf"""
    try:
        from xhtml2pdf import pisa
        
        print(f"Converting {html_file} to {pdf_file} using xhtml2pdf...")
        
        # Read HTML file
        with open(html_file, 'r', encoding='utf-8') as source_file:
            html_content = source_file.read()
        
        # Create PDF
        with open(pdf_file, 'wb') as result_file:
            pdf = pisa.CreatePDF(
                html_content,
                dest=result_file,
                encoding='utf-8'
            )
        
        if not pdf.err:
            print(f"✓ Successfully created {pdf_file}")
            file_size = os.path.getsize(pdf_file) / 1024
            print(f"  File size: {file_size:.2f} KB")
            return True
        else:
            print(f"Error creating PDF: {pdf.err}")
            return False
            
    except ImportError:
        print("xhtml2pdf not installed. Install with: pip install xhtml2pdf")
        return False
    except Exception as e:
        print(f"Error with xhtml2pdf: {e}")
        return False

def convert_with_weasyprint_direct(html_file, pdf_file):
    """Direct WeasyPrint conversion with better error handling"""
    try:
        from weasyprint import HTML
        
        print(f"Converting {html_file} to {pdf_file} using WeasyPrint...")
        
        HTML(filename=html_file).write_pdf(pdf_file)
        
        print(f"✓ Successfully created {pdf_file}")
        file_size = os.path.getsize(pdf_file) / 1024
        print(f"  File size: {file_size:.2f} KB")
        return True
        
    except ImportError:
        print("WeasyPrint not installed.")
        return False
    except Exception as e:
        print(f"Error with WeasyPrint: {e}")
        return False

def main():
    html_file = "academic_poster.html"
    pdf_file = "academic_poster.pdf"
    
    if not os.path.exists(html_file):
        print(f"Error: {html_file} not found!")
        return
    
    print("=" * 60)
    print("Academic Poster PDF Converter")
    print("=" * 60)
    print(f"Input:  {html_file}")
    print(f"Output: {pdf_file}")
    print("=" * 60)
    print()
    
    # Try xhtml2pdf first (better on Windows)
    if convert_with_xhtml2pdf(html_file, pdf_file):
        print("\n" + "=" * 60)
        print("Conversion completed successfully!")
        print("=" * 60)
        print(f"\nPDF saved as: {os.path.abspath(pdf_file)}")
        return
    
    # Fallback to WeasyPrint
    print("\nTrying WeasyPrint as fallback...")
    if convert_with_weasyprint_direct(html_file, pdf_file):
        print("\n" + "=" * 60)
        print("Conversion completed successfully!")
        print("=" * 60)
        print(f"\nPDF saved as: {os.path.abspath(pdf_file)}")
        return
    
    print("\n" + "=" * 60)
    print("ERROR: Could not convert HTML to PDF")
    print("=" * 60)
    print("\nPlease install xhtml2pdf:")
    print("  pip install xhtml2pdf")
    print("\nOr try manual browser conversion:")
    print("  1. Open academic_poster.html in Chrome/Edge")
    print("  2. Press Ctrl+P")
    print("  3. Select 'Save as PDF'")
    print("  4. Choose A0 or A1 paper size")
    print("=" * 60)

if __name__ == "__main__":
    main()

