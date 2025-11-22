from pathlib import Path
import re, sys

root = Path("index.html")
text = root.read_text(encoding="utf-8")
matches = list(re.finditer(r"<script>([\s\S]*?)</script>", text))
if not matches:
    sys.exit("No inline <script> block found")
inline = matches[-1]
js = inline.group(1)
src = Path("src")
src.mkdir(exist_ok=True)
(src / "main.js").write_text(js.lstrip("\n"), encoding="utf-8")
replacement = '<script type="module" src="src/main.js"></script>'
text_new = text[:inline.start()] + replacement + text[inline.end():]
root.write_text(text_new, encoding="utf-8")
print("Extracted to", src / "main.js")
