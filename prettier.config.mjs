/**
 * @type {import("prettier").Config}
 */
const config = {
  printWidth: 100,
  singleQuote: true,
  trailingComma: 'all',
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};

export default config;
