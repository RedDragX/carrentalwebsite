import subprocess
import os
import sys

def main():
    print("Starting NLP service for driver reviews...")
    try:
        from flask import Flask
        import numpy as np
        print("Required packages already installed.")
    except ImportError:
        print("Installing required packages...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "--user", "flask", "numpy"])
        print("Packages installed successfully.")
    
    # Run the NLP service
    from nlp_service import app
    app.run(host='0.0.0.0', port=5001)

if __name__ == "__main__":
    main()