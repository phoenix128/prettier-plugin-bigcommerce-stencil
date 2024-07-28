const { parse } = require('@handlebars/parser');

const removeIndent = (text) => {
    return text.split('\n').map(t => t.trimStart()).join('\n');
}

const preprocess = (text) => {
    if (text.startsWith('---')) {
        const [_, heading, hbs] = text.split(/^---\n/m);
        return '---\n' + heading + '---\n' + removeIndent(hbs);
    }

    return removeIndent(text);
}

const addIndentation = (text, apply, options) => {
    const tabWidth = options.tabWidth || 4;
    const indent = options.useTabs ? '\t' : ' '.repeat(tabWidth);

    return apply ? text.split('\n').map(line => line.length > 0 ? indent + line : '').join('\n') : text;
}

const isMultilineNode = (node) => node.loc.start.line < node.loc.end.line;
const isLongNode = (node, options) => node.loc.end.column > (options.printWidth || 80);

const extractParams = (node, options, print) => {
    const recursivePrint = (n) => printNode(n, options, print);

    const isMultilineParams = node.hash && isMultilineNode(node.hash);
    const isLong = isLongNode(node, options);

    const shouldBreak = isMultilineParams || isLong;
    if (node.hash) {
        node.hash.shouldBreak = shouldBreak;
    }

    const params = node.params.length > 0 ? (' ' + (node.params.map(recursivePrint).join(shouldBreak ? "\n" : ' '))) : '';
    const hash = node.hash ? ` ${recursivePrint(node.hash)}` : '';

    return addIndentation(`${params}${hash}`, shouldBreak, options);
}

const processOutput = (output) => {
    return output
        .replaceAll(/\n{3,}/gm, "\n\n")
        .replaceAll(/[^\S\r\n]+(?=\r?\n|$)/gm, '')
        .trim();
}

const printNode = (node, options, print) => {
    if (!node) {
        console.error('Node is undefined');
        return '';
    }

    const recursivePrint = (n) => printNode(n, options, print);
    const quote = options.singleQuote ? "'" : '"';

    const isMultiline = isMultilineNode(node);

    try {
        switch (node.type) {
            case 'Program':
                return node.body.map(recursivePrint).join('');

            case 'ContentStatement':
                return node.original;

            case 'MustacheStatement':
                const mustacheParams = extractParams(node, options, print);
                const mustacheContent = `${recursivePrint(node.path)}${mustacheParams}`;

                return node.escaped ? `{{${mustacheContent}}}` : `{{{${mustacheContent}}}}`;

            case 'BlockStatement':
                const blockParams = extractParams(node, options, print);

                const openBlock = `{{#${recursivePrint(node.path)}${blockParams}}}`;
                const blockBody = node.program ? addIndentation(recursivePrint(node.program), isMultiline, options) : '';

                const inverseSection = node.inverse ? `{{else}}${addIndentation(recursivePrint(node.inverse), isMultiline, options)}` : '';
                const closeBlock = `{{/${recursivePrint(node.path)}}}`;

                return `${openBlock}${blockBody}${inverseSection}${closeBlock}`;

            case 'PartialStatement':
                const partialParams = extractParams(node, options, print);
                return `{{> ${recursivePrint(node.name)}${partialParams}}}`;

            case 'CommentStatement':
                return `{{!--${node.value}--}}`;

            case 'PathExpression':
                return node.original.trim();

            case 'StringLiteral':
                const escapedValue = node.value.replace(new RegExp(quote, 'g'), `\\${quote}`);
                return `${quote}${escapedValue}${quote}`;

            case 'Hash':
                const trailing = node.shouldBreak ? '\n' : '';
                const separator = node.shouldBreak ? '' : ' ';
                return node.pairs.map(pair => `${trailing}${pair.key}=${recursivePrint(pair.value)}`).join(separator);

            case 'BooleanLiteral':
                return node.value ? 'true' : 'false';

            default:
                console.error(`Unknown node type: ${node.type}`);
                return node.original?.trim() || '';
        }
    } catch (error) {
        console.error('Error processing node:', error.message);
        return '';
    }
};

module.exports = {
    languages: [
        {
            name: "Prettier plugins for BigCommerce Stencil",
            parsers: ["stencil-html"],
            extensions: [".html"],
            vscodeLanguageIds: ["handlebars"]
        }
    ],
    defaultOptions: {
        tabWidth: 4,
        singleQuote: false,
        useTabs: false
    },
    parsers: {
        "stencil-html": {
            astFormat: "stencil-html-ast",
            preprocess,
            parse
        }
    },
    printers: {
        "stencil-html-ast": {
            print: (path, options, print) => processOutput(printNode(path.getValue(), options, print)),
        },
    }
};
