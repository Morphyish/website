# Lazy Image

```tsx title="/src/**/LazyImage.tsx"
import React from 'react';

const imageCache = new Set();

function useSuspenseImage(src: string | undefined) {
  if (src && !imageCache.has(src)) {
    throw new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imageCache.add(src);
        resolve(null);
      };
    });
  }
}

const SuspenseImage = React.forwardRef((
  { src, alt, ...props }: React.HTMLProps<HTMLImageElement>,
  ref: React.Ref<HTMLImageElement>,
) => {
  useSuspenseImage(src);
  return <img src={src} alt={alt} ref={ref} {...props} />;
});

interface LazyImageProps extends React.HTMLProps<HTMLImageElement> {
  fallback?: React.ReactNode;
}

export const LazyImage = React.forwardRef((
  { fallback = null, src, ...props }: React.HTMLProps<LazyImageProps>,
  ref: React.Ref<HTMLImageElement>,
) => {
  if (!src) {
    return <>{fallback}</>;
  }

  return (
    <React.Suspense fallback={fallback}>
      <SuspenseImage src={src} ref={ref} {...props} />
    </React.Suspense>
  );
});
```
