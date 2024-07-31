import preprocessStencil from "./stencil-html/preprocess-stencil.js";

import { parsers as htmlParsers, printers as htmlPrinters } from "prettier/plugins/html";
import { printer } from "prettier/doc";

import printStencil from "./stencil-html/print-stencil.js";
import reverseMustaches from "./stencil-html/revert-mustaches.js";

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
        print: (path, options, print) => {
            const res = printStencil(path, options, print);

            // CHeck if it is the print for root and postprocess the output
            if (path.parent?.type === 'root') {
                const formatted = printer.printDocToString(res, options).formatted;
                return reverseMustaches(formatted);
            }

            return res;
        }
    }
};
