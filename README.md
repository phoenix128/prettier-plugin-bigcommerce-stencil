# Prettier Plugin for BigCommerce Stencil

This Prettier plugin provides enhanced formatting for BigCommerce Stencil templates using Handlebars syntax. It aims to improve readability and maintainability of stencil templates by applying consistent styling rules.

## Features

- **Indentation Control:** Customize indentation using tabs or spaces to match your project's style guidelines.
- **Quote Style Consistency:** Option to enforce the use of single or double quotes.
- **Minimal and Clean Output:** Reduces excessive newlines and trims unnecessary whitespace.

## Installation

To install the plugin, add it to your project using npm or yarn:

```bash
npm install --save-dev prettier-plugin-bigcommerce-stencil
```

or

```bash
yarn add --dev prettier-plugin-bigcommerce-stencil
```

## Usage

After installation, the plugin will automatically be recognized by Prettier. To use it with your Prettier configuration, ensure your .prettierrc file includes the necessary configuration to enable this plugin.

Example .prettierrc configuration:

```json
{
  "tabWidth": 4,
  "singleQuote": true,
  "printWidth": 100,
  "useTabs": false,
  "plugins": ["prettier-plugin-bigcommerce-stencil"],
  "overrides": [
    {
      "files": "*.html",
      "options": {
        "parser": "stencil-html"
      }
    }
  ]
}
```

## Options

This plugin supports the following options to customize the formatting:

- **tabWidth (default: 4)**: Set the number of spaces per indentation level.
- **useTabs (default: false)**: Use tabs for indentation.
- **singleQuote (default: false)**: Use single quotes instead of double quotes where applicable.

## Visual Studio Code Setup

To enable formatting with this Prettier plugin in Visual Studio Code, you need to modify your `settings.json` file to associate `.html` files with Handlebars and set Prettier as the default formatter for these files. Additionally, you can enable automatic formatting on save. Add the following configurations to your `settings.json`:

```json
{
    "files.associations": {
        "*.html": "handlebars"
    },
    "[handlebars]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "editor.formatOnSave": true
    }
}
```

This setup ensures that every time you save a .html file identified as Handlebars, it is automatically formatted according to the specified Prettier rules.

## Contributing

Contributions are welcome! Please submit any bugs, issues, or feature requests through the project's GitHub issue tracker.

## License

Distributed under the MIT License. See LICENSE for more information.
