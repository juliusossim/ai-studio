import nx from '@nx/eslint-plugin';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

const sourceFiles = ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'];
const allScriptFiles = [
  '**/*.ts',
  '**/*.tsx',
  '**/*.cts',
  '**/*.mts',
  '**/*.js',
  '**/*.jsx',
  '**/*.cjs',
  '**/*.mjs',
];
const testAndConfigFiles = [
  '**/*.spec.ts',
  '**/*.spec.tsx',
  '**/*.test.ts',
  '**/*.test.tsx',
  '**/*.spec.js',
  '**/*.spec.jsx',
  '**/*.test.js',
  '**/*.test.jsx',
  '**/jest.config.*',
  '**/vite.config.*',
  '**/webpack.config.*',
  '**/eslint.config.*',
];

export default [
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '**/dist',
      '**/out-tsc',
      '**/.react-router',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
    ],
  },
  {
    files: sourceFiles,
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [String.raw`^.*/eslint(\.base)?\.config\.[cm]?[jt]s$`],
          depConstraints: [
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:shared'],
            },
            {
              sourceTag: 'scope:ai',
              onlyDependOnLibsWithTags: ['scope:shared', 'scope:ai'],
            },
            {
              sourceTag: 'scope:ui',
              onlyDependOnLibsWithTags: ['scope:shared', 'scope:ui'],
            },
            {
              sourceTag: 'scope:feature',
              onlyDependOnLibsWithTags: ['scope:shared', 'scope:ai', 'scope:ui', 'scope:feature'],
            },
            {
              sourceTag: 'scope:app',
              onlyDependOnLibsWithTags: [
                'scope:shared',
                'scope:ai',
                'scope:ui',
                'scope:feature',
                'scope:app',
              ],
            },
            {
              sourceTag: 'layer:ui-foundation',
              onlyDependOnLibsWithTags: ['scope:shared', 'layer:ui-foundation'],
            },
            {
              sourceTag: 'layer:ui-composed',
              onlyDependOnLibsWithTags: [
                'scope:shared',
                'layer:ui-foundation',
                'layer:ui-composed',
              ],
            },
            {
              sourceTag: 'layer:ui-web',
              onlyDependOnLibsWithTags: [
                'scope:shared',
                'layer:ui-foundation',
                'layer:ui-composed',
                'layer:ui-web',
              ],
            },
            {
              sourceTag: 'layer:feature',
              onlyDependOnLibsWithTags: [
                'scope:shared',
                'scope:ai',
                'layer:ui-foundation',
                'layer:ui-composed',
                'layer:ui-web',
                'layer:feature',
              ],
            },
            {
              sourceTag: 'layer:app',
              onlyDependOnLibsWithTags: [
                'scope:shared',
                'scope:ai',
                'layer:ui-foundation',
                'layer:ui-composed',
                'layer:ui-web',
                'layer:feature',
                'layer:app',
              ],
            },
          ],
        },
      ],
    },
  },
  {
    files: allScriptFiles,
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          minimumDescriptionLength: 10,
          'ts-check': false,
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': true,
          'ts-nocheck': true,
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          disallowTypeAnnotations: false,
          fixStyle: 'separate-type-imports',
          prefer: 'type-imports',
        },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-empty-function': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/prefer-as-const': 'error',
      'array-callback-return': 'error',
      'block-scoped-var': 'error',
      curly: ['error', 'all'],
      'default-case-last': 'error',
      'dot-notation': ['error', { allowPattern: '^[A-Z0-9_]+$|^[a-z]+(_[a-z]+)+$' }],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'max-len': [
        'error',
        {
          code: 100,
          ignorePattern: String.raw`^\s*(import\s|export\s.*from\s|.*\bd=)`,
          ignoreRegExpLiterals: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreUrls: true,
          tabWidth: 2,
        },
      ],
      'no-alert': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-duplicate-imports': ['error', { allowSeparateTypeImports: true, includeExports: true }],
      'no-else-return': ['error', { allowElseIf: false }],
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-implicit-coercion': 'error',
      'no-lonely-if': 'error',
      'no-multi-assign': 'error',
      'no-nested-ternary': 'error',
      'no-param-reassign': ['error', { props: true }],
      'no-promise-executor-return': 'error',
      'no-return-await': 'error',
      'no-sequences': 'error',
      'no-template-curly-in-string': 'error',
      'no-throw-literal': 'error',
      'no-unneeded-ternary': 'error',
      'no-unreachable-loop': 'error',
      'no-useless-return': 'error',
      'object-shorthand': ['error', 'always'],
      'one-var': ['error', 'never'],
      'prefer-const': ['error', { destructuring: 'all' }],
      'prefer-object-spread': 'error',
      'prefer-template': 'error',
      radix: 'error',
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/rules-of-hooks': 'error',
    },
  },
  {
    files: ['**/*.tsx', '**/*.jsx'],
    rules: {
      ...jsxA11y.configs.strict.rules,
      'jsx-a11y/label-has-associated-control': 'off',
      'jsx-a11y/no-autofocus': ['error', { ignoreNonDOM: true }],
      'react/button-has-type': 'error',
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'function-declaration',
          unnamedComponents: 'arrow-function',
        },
      ],
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-curly-brace-presence': [
        'error',
        {
          children: 'never',
          propElementValues: 'always',
          props: 'never',
        },
      ],
      'react/jsx-fragments': ['error', 'syntax'],
      'react/jsx-key': ['error', { checkFragmentShorthand: true }],
      'react/jsx-no-leaked-render': ['error', { validStrategies: ['ternary'] }],
      'react/jsx-no-target-blank': ['error', { allowReferrer: false }],
      'react/jsx-no-useless-fragment': 'error',
      'react/jsx-pascal-case': 'error',
      'react/no-array-index-key': 'error',
      'react/no-danger': 'error',
      'react/no-unstable-nested-components': ['error', { allowAsProps: true }],
      'react/no-unknown-property': 'error',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/self-closing-comp': 'error',
    },
  },
  {
    files: testAndConfigFiles,
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'no-console': 'off',
    },
  },
];
