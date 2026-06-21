#!/usr/bin/env python3
from html.parser import HTMLParser
import os

TARGET_TAGS = set(['p','h1','h2','h3','h4','h5','h6','li','label','figcaption','blockquote','small','span','div'])
# We'll consider span/div but only remove hyphens in them if they have class names typical of headings/subs
CLASS_WHITELIST = set(['eyebrow','section-title','section-sub','sec-lbl','p-sub','p-tag','p-tags','mph-lbl','mph-note','stat-lbl','stat-big','cs-panel-nav-title','cs-tag','p-thumb-label'])

class HyphenRemover(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.out = []
        self.tagstack = []
        self.attrsstack = []

    def handle_starttag(self, tag, attrs):
        self.tagstack.append(tag)
        self.attrsstack.append(dict(attrs))
        # reconstruct start tag
        s = '<' + tag
        for k,v in attrs:
            if v is None:
                s += ' ' + k
            else:
                # escape double quotes in attr value
                v2 = v.replace('"','&quot;')
                s += f' {k}="{v2}"'
        s += '>'
        self.out.append(s)

    def handle_startendtag(self, tag, attrs):
        s = '<' + tag
        for k,v in attrs:
            if v is None:
                s += ' ' + k
            else:
                v2 = v.replace('"','&quot;')
                s += f' {k}="{v2}"'
        s += '/>'
        self.out.append(s)

    def handle_endtag(self, tag):
        # pop if matches
        if self.tagstack:
            self.tagstack.pop()
            self.attrsstack.pop()
        self.out.append(f'</{tag}>')

    def handle_data(self, data):
        if not data.strip():
            self.out.append(data)
            return
        # decide whether to remove hyphens
        remove = False
        if self.tagstack:
            cur = self.tagstack[-1]
            if cur in ('p','h1','h2','h3','h4','h5','h6','li','label','figcaption','blockquote','small'):
                remove = True
            elif cur in ('span','div'):
                # check class on current attrs
                attrs = self.attrsstack[-1] if self.attrsstack else {}
                cls = attrs.get('class','')
                classes = set(cls.split()) if cls else set()
                if classes & CLASS_WHITELIST:
                    remove = True
        if remove:
            # remove ASCII hyphen, en-dash, em-dash
            new = data.replace('-', '')
            new = new.replace('\u2014', '')
            new = new.replace('\u2013', '')
            new = new.replace('—', '')
            new = new.replace('–', '')
            # collapse multiple whitespace to single space to avoid double spaces
            new = ' '.join(new.split())
            self.out.append(new)
        else:
            self.out.append(data)

    def handle_comment(self, data):
        self.out.append('<!--'+data+'-->')

    def handle_entityref(self, name):
        # remove common dash entities in target text contexts
        if name in ('mdash','ndash'):
            if self.tagstack:
                cur = self.tagstack[-1]
                attrs = self.attrsstack[-1] if self.attrsstack else {}
                cls = attrs.get('class','')
                classes = set(cls.split()) if cls else set()
                if cur in ('p','h1','h2','h3','h4','h5','h6','li','label','figcaption','blockquote','small') or (cur in ('span','div') and classes & CLASS_WHITELIST):
                    return
        self.out.append(f'&{name};')

    def handle_charref(self, name):
        # numeric refs for em/en dash: 8212, 8211
        try:
            num = int(name)
        except:
            num = None
        if num in (8212,8211):
            if self.tagstack:
                cur = self.tagstack[-1]
                attrs = self.attrsstack[-1] if self.attrsstack else {}
                cls = attrs.get('class','')
                classes = set(cls.split()) if cls else set()
                if cur in ('p','h1','h2','h3','h4','h5','h6','li','label','figcaption','blockquote','small') or (cur in ('span','div') and classes & CLASS_WHITELIST):
                    return
        self.out.append(f'&#{name};')

    def handle_decl(self, decl):
        self.out.append(f'<!{decl}>')

    def get_html(self):
        return ''.join(self.out)


def process_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        orig = f.read()
    parser = HyphenRemover()
    parser.feed(orig)
    new = parser.get_html()
    if new != orig:
        bak = path + '.bak'
        if not os.path.exists(bak):
            with open(bak, 'w', encoding='utf-8') as f:
                f.write(orig)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new)
        return True
    return False

if __name__ == '__main__':
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    modified = []
    for dirpath, dirnames, filenames in os.walk(root):
        # skip .git
        if '.git' in dirpath.split(os.sep):
            continue
        for fn in filenames:
            if fn.lower().endswith('.html'):
                path = os.path.join(dirpath, fn)
                try:
                    changed = process_file(path)
                    if changed:
                        modified.append(path)
                except Exception as e:
                    print('Error processing', path, e)
    if modified:
        print('Modified files:')
        for p in modified:
            print(p)
    else:
        print('No changes made.')
