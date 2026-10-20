import sys
from pathlib import Path

# The backend modules import each other as top-level packages (e.g. `from parser...`),
# so put backend/ on the path the same way `uvicorn --app-dir backend` does.
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
