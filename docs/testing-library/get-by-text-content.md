# getByTextContent

The `getByText` function from Testing Library doesn't work when the text is broken by other elements.

Unfortunately this is very common when using inline formatting,
or if you want to test if a code snippet is properly rendering.

As a workaround, it is possible to use the following function:

```ts
import { screen } from '@testing-library/react';

function hasText(el: HTMLElement) {
  return !!el.textContent?.includes(text);
}

export function getByTextContent(text: string) {
  try {
    return screen.getByText((_, element: any) => {
      // Make sure that we can find the full text inside the current element
      const elementHasText = hasText(element);
      // Make sure that we are not returning a parent element
      const childrenDontHaveText = Array.from(element?.children ?? []).every((child: any) => !hasText(child));
      return elementHasText && childrenDontHaveText;
    })
  } catch {
    throw new Error(`Could not find the following text: "${text}"`);
  }
}
```
