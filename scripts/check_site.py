"""Check local links/assets and preservation of published content after a Hugo build."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import sys

root = Path('public')
errors = []
class Links(HTMLParser):
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        for key in ('href', 'src'):
            value = attrs.get(key, '')
            url = urlsplit(value)
            if not value or url.scheme or url.netloc or value.startswith('#'):
                continue
            target = root / unquote(url.path).lstrip('/') if value.startswith('/') else page.parent / unquote(url.path)
            if not target.exists() and not (target / 'index.html').exists():
                errors.append(f'{page}: missing {value}')

for page in root.rglob('*.html'):
    Links().feed(page.read_text())
for source in Path('content').rglob('*.md'):
    route = root / Path(str(source.relative_to('content').with_suffix('')).lower()) / 'index.html'
    if not route.exists():
        errors.append(f'Missing content route: {route}')
for source in Path('content/projects').glob('*.md'):
    if 'ai_generated = true' in source.read_text():
        page = root / 'projects' / source.stem.lower() / 'index.html'
        if page.exists() and 'AI-generated write-up' not in page.read_text():
            errors.append(f'Missing AI disclosure: {page}')
if errors:
    print('\n'.join(sorted(set(errors))))
    sys.exit(1)
print('All content routes, internal links, and local assets resolve.')
