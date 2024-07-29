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

    const lines = text.split('\n').map(line => line.length > 0 ? indent + line : '');
    return apply && lines.length > 0 ? lines.join('\n') : text;
}

const isMultilineNode = (node) => {
    return node.loc && node.loc.start && node.loc.end
        ? node.loc.start.line < node.loc.end.line
        : false;
};

const isLongNode = (node, options) => {
    return node.loc && node.loc.start && node.loc.end
        ? node.loc.end.column > (options.printWidth || 80)
        : false;
};

const extractParams = (node, options, print) => {
    const wasMultilineHash = node.hash && isMultilineNode(node.hash);
    const shouldIndent = node.hash && (wasMultilineHash || isLongNode(node.hash, options));

    const recursivePrint = (n) => printNode(n, options, print);
    const separator = shouldIndent ? '\n' : ' ';

    const params = node.params?.map(recursivePrint) || [];
    const hashes = node.hash?.pairs.map((pair, index) => {
        const key = pair.key;
        const value = recursivePrint(pair.value);
        return `${key}=${value}`;
    }) || [];

    const res = [...params, ...hashes].map(t => t.trim()).filter(Boolean).join(separator);
    if (res.length > 0) {
        const trailing = shouldIndent ? '\n' : ' ';
        return trailing + addIndentation(res, shouldIndent, options);
    }

    return '';
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

    const wasMultiline = isMultilineNode(node);
    const wasLong = isLongNode(node, options);
    const shouldIndent = wasMultiline || wasLong;

    const params = extractParams(node, options, print);

    const indent = (text) => {
        const leadingCr = shouldIndent && !text.startsWith('\n') ? '\n' : '';
        const trailingCr = shouldIndent && !text.endsWith('\n') ? '\n' : '';

        return leadingCr + addIndentation(text, shouldIndent, options) + trailingCr;
    }

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
            const openBlock =  `{{#${recursivePrint(node.path)}${blockParams}}}`;
            const blockBody = node.program ? indent(recursivePrint(node.program)) : '';
            const inverseSection = node.inverse ? `{{else}}${indent(recursivePrint(node.inverse))}` : '';
            const closeBlock = `{{/${recursivePrint(node.path)}}}`;

            return `${openBlock}${blockBody}${inverseSection}${closeBlock}`;

        case 'PartialStatement':
            return `{{> ${recursivePrint(node.name)}${params}}}`;

        case 'CommentStatement':
            return `{{!--${node.value}--}}`;

        case 'PathExpression':
            return node.original.trim();

        case 'StringLiteral':
            const escapedValue = node.value.replace(new RegExp(quote, 'g'), `\\${quote}`);
            return `${quote}${escapedValue}${quote}`;

        case 'NumberLiteral':
            return node.value.toString();

        case 'BooleanLiteral':
            return node.value ? 'true' : 'false';

        case 'UndefinedLiteral':
            return 'undefined';

        case 'NullLiteral':
            return 'null';

        case 'SubExpression':
            const subParams = extractParams(node, options, print);
            return `(${recursivePrint(node.path)}${subParams})`;

        case 'DecoratorBlock':
            const decoratorBody = node.program ? indent(recursivePrint(node.program)) : '';
            return `{{#*${recursivePrint(node.path)}${params}}}${decoratorBody}{{/${recursivePrint(node.path)}}}`;

        case 'PartialBlockStatement':
            const partialBlockBody = node.program ? indent(recursivePrint(node.program)) : '';
            return `{{#> ${recursivePrint(node.name)}${params}}}${partialBlockBody}{{/${recursivePrint(node.name)}}}`;

        default:
            throw new Error(`Unknown node type: ${node.type}`);
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
        useTabs: false,
        printWidth: 80,
        preserveNewlines: false
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
            print: (path, options, print) => {
                const output = printNode(path.getValue(), options, print);
                return options.preserveNewlines ? output.trim() : processOutput(output);
            },
        },
    }
};
