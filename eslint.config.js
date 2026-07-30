import js from '@eslint/js';
import n from 'eslint-plugin-n';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
  // 0. Ignore build output, deps, and minified vendor files entirely.
  {
    ignores: [
      'node_modules/**',
      'public/assets/js/*.min.js', // vendor / minified — never lint
    ],
  },

  // 1. Base recommended rules for everything.
  js.configs.recommended,

  // 2. Node.js source: server, controllers, scripts, config.
  {
    files: ['**/*.js'],
    ignores: ['public/**'], // exclude client-side code from Node rules
    ...n.configs['flat/recommended-module'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node },
    },
    plugins: { prettier },
    rules: {
      'prettier/prettier': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      // Startup/CLI scripts legitimately exit the process.
      'n/no-process-exit': 'off',
    },
  },

  // 3. Client-side browser scripts.
  {
    files: ['public/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        ...globals.browser,
        // Globals provided by your bundled vendor scripts:
        breakpoints: 'readonly',
        browser: 'readonly',
        Scrollex: 'readonly',
        Scrolly: 'readonly',
        define: 'readonly',
      },
    },
    plugins: { prettier },
    rules: {
      'prettier/prettier': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },

  // 4. Disable formatting rules that conflict with Prettier (must be last).
  prettierConfig,
];
