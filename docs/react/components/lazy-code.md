# Lazy Code

Using [Prism](https://prismjs.com/)

```tsx title="/src/**/code/import-prismjs.ts"
import * as Prism from 'prismjs';

import 'prismjs/themes/prism.min.css/';

// Import all supported languages
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markdown';

export default Prism;
```

```tsx title="/src/**/code/LazyCode.tsx"
import React, { useState } from 'react';

let PrismImport: any;

function usePrism() {
  if (!PrismImport) {
    throw new Promise(async (resolve) => {
      PrismImport = await import('./import-prismjs');
      resolve(null);
    });
  }

  return PrismImport.default;
}

// Valid languages based on the imported list
type PrismLanguages = 'javascript' | 'markdown';

type CodeProps = { code: string; lang?: PrismLanguages; }

function SuspenseCode({ code, lang = 'plain' }: CodeProps) {
  const Prism = usePrism();

  const [html, setHtml] = useState('');
  const [langClassName, setLangClassName] = useState('language-plain');

  useEffect(() => {
    const grammar = Prism?.languages[lang];
    if (grammar) {
      setLangClassName(`language-${lang}`);
      setHtml(Prism?.highlight(code, grammar, lang));
    } else {
      setLangClassName('language-plain');
      setHtml(Prism?.highlight(code, Prism?.languages.plain, 'plain'));
    }
  }, [content, lang]);

  return (
    <pre>
      <code
        role="code"
        dangerouslySetInnerHTML={{ __html: html }}
        spellCheck="false"
        className={langClassName}
      />
    </pre>
  );
}

interface LazyCodeProps extends CodeProps {
  fallback?: React.ReactNode;
}

export function LazyCode({ fallback, ...props }: LazyCodeProps) {
  return (
    <React.Suspense fallback={fallback}>
      <SuspenseCode {...props} />
    </React.Suspense>
  );
}
```
