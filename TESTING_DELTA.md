# TESTING_DELTA.md

## Current Status: INITIALIZED
Vitest and Testing Library are fully integrated.

### Completed
1. **Framework Setup:** Vitest, JSDOM, and Testing Library installed.
2. **Infrastructure:** `src/__tests__/setup.ts` and `vite.config.ts` configuration complete.
3. **Core Tests:** `src/__tests__/store.test.ts` and `src/__tests__/gemini.test.ts` are live.

## Coverage Dashboard (Estimated)
- **Store Logic:** 80%
- **Gemini Helpers:** 90%
- **UI Components:** 5%
- **Overall:** ~15%

## Coverage Gaps (Prioritized)
1. **State Transitions (Zustand):** No verification of complex project addition/deletion logic.
2. **AI Result Parsing:** No validation of the JSON response shape from `lib/gemini.ts`.
3. **Component Rendering:** No tests for mobile-responsive drawer state or Artifact panel switching.

---

## Recommended Framework: Vitest + Testing Library
Vitest is the recommended choice for Vite-based projects.

### Setup Structure
```text
/src
  /__tests__
    store.test.ts
    gemini.test.ts
    /components
      ChatPanel.test.tsx
```

### Bootstrap Test File (`src/__tests__/setup.ts`)
```ts
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
```

### High-Value Test Cases

#### 1. Store Logic (`src/__tests__/store.test.ts`)
Test that adding a project correctly instantiates the template files.
```ts
import { renderHook, act } from '@testing-library/react';
import { useStore } from '../store/useStore';

test('should add project and instantiate template files', () => {
  const { result } = renderHook(() => useStore());
  act(() => {
    result.current.addProject({
      id: 'test-p',
      name: 'Test Project',
      scaffoldType: 'react-pwa',
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  });
  const artifacts = result.current.artifacts.filter(a => a.projectId === 'test-p');
  expect(artifacts.length).toBeGreaterThan(0);
});
```

#### 2. Gemini Response Validation (`src/__tests__/gemini.test.ts`)
Mock the API and ensure the orchestration logic handles malformed JSON.

#### 3. PCard Interaction (`src/__tests__/CardDeck.test.tsx`)
Verify that clicking "Steer Card" triggers the correct view change.
