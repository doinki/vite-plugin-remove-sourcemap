import { readFile, unlink, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

import { glob } from 'glob';
import type { PluginOption } from 'vite';

export interface RemoveSourcemapOptions {
  commentOnly?: boolean;
  outDir: string;
}

export function removeSourcemap({ commentOnly, outDir }: RemoveSourcemapOptions): PluginOption {
  return {
    apply: 'build',
    async closeBundle() {
      const paths = await glob(join(outDir, '**', '*.{cjs,js,mjs,map}'));

      await Promise.all(
        paths.map(async (path) => {
          const extension = extname(path);

          if (['.js', '.mjs', '.cjs'].includes(extension)) {
            return readFile(path, 'utf8').then((code) =>
              writeFile(
                path,
                code.trimEnd().replace(/\s*\/\/#\s*sourcemappingurl=.*$/i, ''),
                'utf8',
              ),
            );
          } else if (!commentOnly && extension === '.map') {
            return unlink(path);
          }
        }),
      );
    },
    enforce: 'post',
    name: 'remove-sourcemap',
  };
}
