"""
Python script to convert HTML academic poster to PDF
Requires: pip install weasyprint
Alternative: pip install pdfkit (requires wkhtmltopdf)
"""

import os
import sys
from pathlib import Path

def convert_with_weasyprint(html_file, pdf_file):
    """Convert HTML to PDF using WeasyPrint (recommended)"""
    try:
        from weasyprint import HTML
        print(f"Converting {html_file} to {pdf_file} using WeasyPrint...")
        HTML(filename=html_file).write_pdf(pdf_file)
        print(f"✓ Successfully created {pdf_file}")
        return True
    except ImportError:
        print("WeasyPrint not installed. Install with: pip install weasyprint")
        return False
    except Exception as e:
        print(f"Error with WeasyPrint: {e}")
        return False

def convert_with_pdfkit(html_file, pdf_file):
    """Convert HTML to PDF using pdfkit (requires wkhtmltopdf)"""
    try:
        import pdfkit
        print(f"Converting {html_file} to {pdf_file} using pdfkit...")
        
        # Configuration for pdfkit
        options = {
            'page-size': 'A0',  # Large format for poster
            'margin-top': '0mm',
            'margin-right': '0mm',
            'margin-bottom': '0mm',
            'margin-left': '0mm',
            'encoding': "UTF-8",
            'no-outline': None,
            'enable-local-file-access': None
        }
        
        pdfkit.from_file(html_file, pdf_file, options=options)
        print(f"✓ Successfully created {pdf_file}")
        return True
    except ImportError:
        print("pdfkit not installed. Install with: pip install pdfkit")
        print("Also install wkhtmltopdf: https://wkhtmltopdf.org/downloads.html")
        return False
    except Exception as e:
        print(f"Error with pdfkit: {e}")
        return False

def convert_with_playwright(html_file, pdf_file):
    """Convert HTML to PDF using Playwright (alternative)"""
    try:
        from playwright.sync_api import sync_playwright
        print(f"Converting {html_file} to {pdf_file} using Playwright...")
        
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()
            
            # Load HTML file
            html_path = Path(html_file).absolute()
            page.goto(f"file://{html_path}")
            
            # Generate PDF
            page.pdf(
                path=pdf_file,
                format='A0',  # Large format for poster
                print_background=True,
                margin={'top': '0mm', 'right': '0mm', 'bottom': '0mm', 'left': '0mm'}
            )
            
            browser.close()
        
        print(f"✓ Successfully created {pdf_file}")
        return True
    except ImportError:
        print("Playwright not installed. Install with: pip install playwright")
        print("Then run: playwright install chromium")
        return False
    except Exception as e:
        print(f"Error with Playwright: {e}")
        return False

def main():
    """Main function to convert HTML poster to PDF"""
    html_file = "academic_poster.html"
    pdf_file = "academic_poster.pdf"
    
    # Check if HTML file exists
    if not os.path.exists(html_file):
        print(f"Error: {html_file} not found!")
        print("Please ensure academic_poster.html exists in the current directory.")
        sys.exit(1)
    
    print("=" * 60)
    print("Academic Poster PDF Converter")
    print("=" * 60)
    print(f"Input:  {html_file}")
    print(f"Output: {pdf_file}")
    print("=" * 60)
    print()
    
    # Try different conversion methods in order of preference
    methods = [
        ("WeasyPrint", convert_with_weasyprint),
        ("Playwright", convert_with_playwright),
        ("pdfkit", convert_with_pdfkit),
    ]
    
    success = False
    for method_name, method_func in methods:
        print(f"\nAttempting conversion with {method_name}...")
        if method_func(html_file, pdf_file):
            success = True
            break
        print(f"{method_name} not available or failed. Trying next method...")
    
    if not success:
        print("\n" + "=" * 60)
        print("ERROR: Could not convert HTML to PDF")
        print("=" * 60)
        print("\nPlease install one of the following:")
        print("\n1. WeasyPrint (Recommended):")
        print("   pip install weasyprint")
        print("\n2. Playwright:")
        print("   pip install playwright")
        print("   playwright install chromium")
        print("\n3. pdfkit (requires wkhtmltopdf):")
        print("   pip install pdfkit")
        print("   Download wkhtmltopdf from: https://wkhtmltopdf.org/downloads.html")
        print("\n" + "=" * 60)
        sys.exit(1)
    
    print("\n" + "=" * 60)
    print("Conversion completed successfully!")
    print("=" * 60)
    print(f"\nPDF file saved as: {os.path.abspath(pdf_file)}")
    print(f"File size: {os.path.getsize(pdf_file) / 1024:.2f} KB")
    print("\nYou can now print or share the PDF poster.")

if __name__ == "__main__":
    main()

