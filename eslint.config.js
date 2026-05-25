import nextPlugin from 'eslint-plugin-next';

export default [
  {
    ignores: ['.next/*', 'node_modules/*', 'dist/*', 'build/*'],
  },
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    plugins: {
      next: nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
];
