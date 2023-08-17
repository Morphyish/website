# renderWithEvents

Simple wrapper around `render` that also returns `userEvent`.

```ts
import type { RenderOptions } from '@testing-library/react';
import type { Options as UserEventOptions } from '@testing-library/user-event/dist/types/options';
import type { ReactElement } from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

type RenderWithEventsOptions = {
  ui?: RenderOptions;
  userEvent?: UserEventOptions;
};

export function renderWithEvents(ui: ReactElement, options?: RenderWithEventsOptions) {
  return {
    userEvent: userEvent.setup(options?.userEvent),
    ...render(ui, options?.ui),
  };
}
```
