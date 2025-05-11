import { join } from 'node:path';

import { includeIgnoreFile } from '@eslint/compat';
import { config } from 'eslint-config-mado';
import * as importConfig from 'eslint-config-mado/import';
import * as jsConfig from 'eslint-config-mado/javascript';
import * as prettierConfig from 'eslint-config-mado/prettier';
import * as sortConfig from 'eslint-config-mado/sort';
import * as tsConfig from 'eslint-config-mado/typescript';
import * as unicornConfig from 'eslint-config-mado/unicorn';
import globals from 'globals';

const gitignorePath = join(import.meta.dirname, '.gitignore');

export default config(
  includeIgnoreFile(gitignorePath),
  { languageOptions: { globals: globals.node } },
  jsConfig.generateConfig(),
  tsConfig.generateConfig({ tsconfigRootDir: import.meta.dirname }),
  importConfig.generateConfig(),
  unicornConfig.generateConfig(),
  sortConfig.generateConfig(),
  prettierConfig.generateConfig(),
);
