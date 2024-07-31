import preprocessStencil from "./stencil-html/preprocess-stencil.js"

import {
    printers as htmlPrinters,
    parsers as htmlParsers
} from 'prettier/plugins/html';
import printStencil from "./stencil-html/print-stencil.js";

export const languages = [
    {
        name: "Prettier plugins for BigCommerce Stencil",
        parsers: ["stencil-html"],
        extensions: [".html"],
        vscodeLanguageIds: ["handlebars", "html"]
    }
];

export const defaultOptions = {
    tabWidth: 4,
    singleQuote: false,
    useTabs: false,
    printWidth: 80,
    preserveNewlines: false
};

export const parsers = {
    "stencil-html": {
        ...htmlParsers.html,
        astFormat: "stencil-html-ast",
        parse: async (text, parsers, options) => {
            const hbs = await preprocessStencil(text, options);
            return htmlParsers.html.parse(hbs, options);
        }
    }
};

export const printers = {
    "stencil-html-ast": {
        ...htmlPrinters.html,
        print: printStencil
    },
};
