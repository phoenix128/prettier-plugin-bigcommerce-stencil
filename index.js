import {
    printers as glimmerPrinters,
    parsers as glimmerParsers
} from 'prettier/plugins/glimmer';
import { printer as docPrinter } from 'prettier/doc';

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
        ...glimmerParsers.glimmer,
        astFormat: "stencil-html-ast",
        parse: (text, options) => {
            // Replace partials with a temporary placeholder since glimmer does not support partials
            const noPartials = text
                .replace(/{{>\s+([^}]+)}}/gm, (match, p1) => {
                    console.log(match)
                    return `{{$partial ${p1.replace(/\//g, '_')}}}`;
                });

            return glimmerParsers.glimmer.parse(noPartials, options);
        }
    }
};

export const printers = {
    "stencil-html-ast": {
        ...glimmerPrinters.glimmer,
        print: (path, options, print) => {
            const output = glimmerPrinters.glimmer.print(path, options, print);
            const { formatted } = docPrinter.printDocToString(output, options);

            // Replace temporary placeholders with the original partials
            if (formatted.startsWith('{{$partial ')) {
                return formatted.replace(/{{\$partial\s+([^}]+)}}/gm, (match, p1) => {
                    return `{{> ${p1.replace(/_/g, '/')}}}`;
                });
            }

            return output;
        }
    },
};
