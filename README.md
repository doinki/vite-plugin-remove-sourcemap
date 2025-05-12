# vite-plugin-remove-sourcemap

## Example

```typescript
import { defineConfig } from 'vite';
import { removeSourcemap } from 'vite-plugin-remove-sourcemap';

export default defineConfig({
  plugins: [removeSourcemap('build/**/*')],
});
```
