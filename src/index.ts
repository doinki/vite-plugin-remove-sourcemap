import { readFile, unlink, writeFile } from 'node:fs/promises';
import { extname } from 'node:path';

import { glob } from 'glob';
import type { PluginOption, ResolvedConfig } from 'vite';

export interface RemoveSourcemapOptions {
  commentOnly?: boolean;
}

const extensions = new Set(['.js', '.mjs', '.cjs']);
const regexp = /\s*\/\/#\s*sourcemappingurl=.*$/i;

export function removeSourcemap(
  pattern: string | string[],
  { commentOnly }: RemoveSourcemapOptions,
): PluginOption {
  let viteConfig: ResolvedConfig;

  return {
    apply: 'build',
    async closeBundle() {
      if (!viteConfig) {
        return;
      }

      const paths = await glob(pattern, {
        absolute: true,
        cwd: viteConfig.root,
        nodir: true,
      });

      await Promise.allSettled(
        paths.map(async (path) => {
          const extension = extname(path);

          if (extensions.has(extension)) {
            const originalCode = await readFile(path, 'utf8');
            const updatedCode = originalCode.trimEnd().replace(regexp, '');

            if (originalCode !== updatedCode) {
              await writeFile(path, updatedCode, 'utf8');
            }
          } else if (!commentOnly && extension === '.map') {
            await unlink(path);
          }
        }),
      );
    },
    configResolved(config) {
      viteConfig = config;
    },
    enforce: 'post',
    name: 'remove-sourcemap',
  };
}
