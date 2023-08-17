# Guards

An easy-to-use pattern for UI driven content guards.

It can be used for feature flags, role limitations, etc...

## Component

```tsx title="/src/**/guards/Guard.tsx"
import React, { PropsWithChildren } from 'react';

function isNil(value: unknown | null | undefined): value is null | undefined {
  return value === null || value === undefined;
}

function getArray<T>(value?: T | T[] | null): T[] {
  if (isNil(value)) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

type GuardProps = { allowed?: boolean; loading?: boolean; };

export const Allowed = ({ children }: PropsWithChildren<unknown>) => <>{children}</>;
export const Fallback = ({ children }: PropsWithChildren<unknown>) => <>{children}</>;
export const Pending = ({ children }: PropsWithChildren<unknown>) => <>{children}</>;

export function Guard({ allowed, pending, children }: PropsWithChildren<GuardProps>) {
  const childrenArray = getArray(children);

  const allowedChildren = childrenArray.filter((child) => child.type?.name === Allowed.name);
  const fallbackChildren = childrenArray.filter((child) => child.type?.name === Fallback.name);
  const pendingChildren = childrenArray.filter((child) => child.type?.name === Pending.name);

  if ((fallbackChildren?.length || pendingChildren?.length) && !allowedChildren?.length) {
    throw new Error('You cannot use <Fallback /> or <Pending /> without <Allowed />');
  }

  if (pending) {
    if (pendingChildren?.length) {
      return <>{pendingChildren}</>;
    }

    return null;
  }

  if (!allowed) {
    if (fallbackChildren?.length) {
      return <>{fallbackChildren}</>;
    }

    return null;
  }

  if (allowedChildren.length) {
    return <>{allowedChildren}</>;
  }

  return <>{children}</>;
}
```

## Usage

### Simple

```tsx title="/src/**/guards/WithRole.tsx"
import React, { PropsWithChildren } from 'react';

import { Guard } from './Guard.tsx';

type WithRoleProps = { role: 'admin' | 'user' };

export function useWithRole({ role }: WithRoleProps) {
  // Implement role check logic here
  
  return { allowed, loading };
}

export function WithRole({ children, ...props }: PropsWithChildren<WithRoleProps>) {
  const { allowed, loading } = useWithRole(props);
  
  return <Guard allowed={allowed} pending={loading} children={children} />
}
```

```tsx title="/src/App.tsx"
import React, { PropsWithChildren } from 'react';

import { WithRole } from './**/guards/WithRole';

export function App() {
  return (
    <main>
      <h1>My Website</h1>
      <WithRole role="admin">
        <p>Secret content only for admins</p>
      </WithRole>
    </main>
  )
}
```

### With Fallback and Pending content

```tsx title="/src/**/guards/WithFeatureFlag.tsx"
import React, { PropsWithChildren } from 'react';

import { Guard } from './Guard.tsx';

type WithFeatureFlagProps = { feature: 'future-home' };

export function useWithFeatureFlag({ role }: WithFeatureFlagProps) {
  // Implement feature flag logic here

  return { allowed, loading };
}

export function WithFeatureFlag({ children, ...props }: PropsWithChildren<WithFeatureFlagProps>) {
  const { allowed, loading } = useWithRole(props);

  return <Guard allowed={allowed} pending={loading} children={children}/>;
}
```

```tsx title="/src/App.tsx"
import React, { PropsWithChildren } from 'react';

import { FutureHome, Home } from './**/home';
import { WithFeatureFlag } from './**/guards/WithFeatureFlag';

export function App() {
  return (
    <main>
      <h1>My Website</h1>
      <WithFeatureFlag feature="future-home">
        <Allowed>
          <FutureHome />
        </Allowed>
        <Fallback>
          <Home />
        </Fallback>
        <Pending>
          <p>Loading...</p>
        </Pending>
      </WithFeatureFlag>
    </main>
  )
}
```