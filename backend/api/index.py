import sys

# Remove Vercel's vendored packages from path so our requirements.txt versions are used
sys.path = [p for p in sys.path if '_vendor' not in p]

from server import app
