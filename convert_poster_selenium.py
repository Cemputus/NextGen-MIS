"""
Convert HTML poster to PDF using Selenium with Chrome
This method uses Chrome's built-in PDF printing capability
"""

import os
import time
from pathlib import Path

def convert_with_selenium(html_file, pdf_file):
    """Convert HTML to PDF using Selenium Chrome"""
    try:
        from selenium import webdriver
        from selenium.webdriver.chrome.options import Options
        from selenium.webdriver.chrome.service import Service
        
        print(f"Converting {html_file} to {pdf_file} using Selenium Chrome...")
        
        # Chrome options for headless PDF printing
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        
        # Enable print to PDF
        chrome_options.add_experimental_option('prefs', {
            'printing.print_preview_sticky_settings.appState': '{"recentDestinations":[{"id":"Save as PDF","origin":"local","account":""}],"selectedDestinationId":"Save as PDF","version":2}'
        })
        
        # Get absolute path to HTML file
        html_path = Path(html_file).absolute().as_uri()
        
        try:
            driver = webdriver.Chrome(options=chrome_options)
            driver.get(html_path)
            
            # Wait for page to load
            time.sleep(2)
            
            # Use Chrome's print to PDF
            print_options = {
                'printBackground': True,
                'paperWidth': 33.1,  # A0 width in inches
                'paperHeight': 46.8,  # A0 height in inches
                'marginTop': 0,
                'marginBottom': 0,
                'marginLeft': 0,
                'marginRight': 0
            }
            
            result = driver.execute_cdp_cmd('Page.printToPDF', print_options)
            
            # Save PDF
            import base64
            pdf_data = base64.b64decode(result['data'])
            with open(pdf_file, 'wb') as f:
                f.write(pdf_data)
            
            driver.quit()
            
            print(f"✓ Successfully created {pdf_file}")
            file_size = os.path.getsize(pdf_file) / 1024
            print(f"  File size: {file_size:.2f} KB")
            return True
            
        except Exception as e:
            print(f"Error with Selenium: {e}")
            print("Make sure Chrome browser and ChromeDriver are installed")
            return False
            
    except ImportError:
        print("Selenium not installed. Install with: pip install selenium")
        print("Also install ChromeDriver: https://chromedriver.chromium.org/")
        return False
    except Exception as e:
        print(f"Error: {e}")
        return False

def main():
    html_file = "academic_poster.html"
    pdf_file = "academic_poster.pdf"
    
    if not os.path.exists(html_file):
        print(f"Error: {html_file} not found!")
        return
    
    print("=" * 60)
    print("Academic Poster PDF Converter (Selenium)")
    print("=" * 60)
    print(f"Input:  {html_file}")
    print(f"Output: {pdf_file}")
    print("=" * 60)
    print()
    
    if convert_with_selenium(html_file, pdf_file):
        print("\n" + "=" * 60)
        print("Conversion completed successfully!")
        print("=" * 60)
        print(f"\nPDF saved as: {os.path.abspath(pdf_file)}")
    else:
        print("\n" + "=" * 60)
        print("Manual Conversion Instructions:")
        print("=" * 60)
        print("\n1. Open academic_poster.html in Chrome or Edge")
        print("2. Press Ctrl+P (or Cmd+P on Mac)")
        print("3. Select 'Save as PDF' as destination")
        print("4. Choose 'More settings'")
        print("5. Set Paper size to 'A0' or 'A1'")
        print("6. Set Margins to 'None'")
        print("7. Enable 'Background graphics'")
        print("8. Click 'Save'")
        print("=" * 60)

if __name__ == "__main__":
    main()

