import { builders, printer } from "prettier/doc";

const { group, join, indent, softline, line, hardline, breakParent } = builders;
const { printDocToString } = printer;

const printPath = (path, print) => {
    if (path.node?.name?.type === "PathExpression") {
        return printPathExpression(path.node?.name);
    }

    return print("path");
}

const printParams = (path, print) => {
    const { node } = path;
    const parts = [];

    if (node.params.length > 0) {
        parts.push(...path.map(print, "params"));
    }

    if (node.hash?.pairs.length > 0) {
        parts.push(print("hash"));
    }

    if (parts.length === 0) {
        return "";
    }

    return join(line, parts);
}
const printPathAndParams = (path, print) => {
    const pathDoc = printPath(path, print);
    const paramsDoc = printParams(path, print);

    if (!paramsDoc) {
        return pathDoc;
    }

    return [indent([pathDoc, line, paramsDoc]), softline];
}

const isWhitespaceNode = (node) => {
    return node.type === "TextNode" && !/\S/u.test(node.chars);
}

const blockStatementHasOnlyWhitespaceInProgram = (node) => {
    return (
        node.type === "BlockStatement" &&
        node.program.body.every((node) => isWhitespaceNode(node))
    );
}

const printProgram = (path, print, options) => {
    const { node } = path;

    if (blockStatementHasOnlyWhitespaceInProgram(node)) {
        return "";
    }

    const program = print("program");

    if (options.htmlWhitespaceSensitivity === "ignore") {
        return indent([hardline, program]);
    }

    return indent([softline, program]);
}

const printOpeningMustache = (node) => {
    const mustache = node.triple ? "{{{" : "{{";
    const strip = node.strip?.open ? "~" : "";
    return [mustache, strip];
}

const printClosingMustache = (node) => {
    const mustache = node.triple ? "}}}" : "}}";
    const strip = node.strip?.close ? "~" : "";
    return [strip, mustache];
}

const printOpeningPartial = (node) => {
    return ['{{>', " "];
}

const printClosingPartial = (node) => {
    return ['}}'];
}

const printStringLiteral = (path, options) => {
    const {
        node: { value },
    } = path;

    const quote = options.singleQuote ? "'" : '"';

    return [quote, value.replaceAll(quote, `\\${quote}`), quote];
}

const printInverseBlockOpeningMustache = (node) => {
    const opening = printOpeningMustache(node);
    const strip = node.inverseStrip.open ? "~" : "";
    return [opening, strip];
}

const isNonEmptyArray = (object) => {
    return Array.isArray(object) && object.length > 0;
}

const printBlockParams = (node) => {
    return ["as |", node.blockParams.join(" "), "|"];
}

const printInverseBlockClosingMustache = (node) => {
    const closing = printClosingMustache(node);
    const strip = node.inverseStrip.close ? "~" : "";
    return [strip, closing];
}

const printElseIfLikeBlock = (path, print) => {
    const { node, grandparent } = path;
    return group([
        printInverseBlockOpeningMustache(grandparent),
        ["else", " ", grandparent.inverse.body[0].path.head.name],
        indent([
            line,
            group(printParams(path, print)),
            ...(isNonEmptyArray(node.program.blockParams)
              ? [line, printBlockParams(node.program)]
              : []),
        ]),
        softline,
        printInverseBlockClosingMustache(grandparent),
    ]);
}

const isPathWithSameHead = (pathA, pathB) =>
  pathA.head.type === "VarHead" &&
  pathB.head.type === "VarHead" &&
  pathA.head.name === pathB.head.name;

const blockStatementHasElse = (node) => {
    return node.type === "BlockStatement" && node.inverse;
}

const blockStatementHasElseIfLike = (node) => {
    return (
      blockStatementHasElse(node) &&
      node.inverse.body.length === 1 &&
      node.inverse.body[0].type === "BlockStatement" &&
      isPathWithSameHead(node.inverse.body[0].path, node.path)
    );
}

const printElseBlock = (node, options) => {
    return [
        options.htmlWhitespaceSensitivity === "ignore" ? hardline : "",
        printInverseBlockOpeningMustache(node),
        "else",
        printInverseBlockClosingMustache(node),
    ];
}

const printInverse = (path, print, options) => {
    const { node } = path;

    const inverse = print("inverse");
    const printed =
      options.htmlWhitespaceSensitivity === "ignore"
        ? [hardline, inverse]
        : inverse;

    if (blockStatementHasElseIfLike(node)) {
        return printed;
    }

    if (blockStatementHasElse(node)) {
        return [printElseBlock(node, options), indent(printed)];
    }

    return "";
}

const printOpeningBlockOpeningMustache = (node) => {
    const opening = printOpeningMustache(node);
    const strip = node.openStrip.open ? "~" : "";
    return [opening, strip, "#"];
}

const printOpeningBlockClosingMustache = (node) => {
    const closing = printClosingMustache(node);
    const strip = node.openStrip.close ? "~" : "";
    return [strip, closing];
}

const printClosingBlockOpeningMustache = (node) => {
    const opening = printOpeningMustache(node);
    const strip = node.closeStrip.open ? "~" : "";
    return [opening, strip, "/"];
}

const printClosingBlockClosingMustache = (node) => {
    const closing = printClosingMustache(node);
    const strip = node.closeStrip.close ? "~" : "";
    return [strip, closing];
}


const printOpenBlock = (path, print) => {
    const { node } = path;
    /** @type {Doc[]} */
    const parts = [];

    const paramsDoc = printParams(path, print);
    if (paramsDoc) {
        parts.push(group(paramsDoc));
    }

    if (isNonEmptyArray(node.program.blockParams)) {
        parts.push(printBlockParams(node.program));
    }

    return group([
        printOpeningBlockOpeningMustache(node),
        printPath(path, print),
        parts.length > 0 ? indent([line, join(line, parts)]) : "",
        softline,
        printOpeningBlockClosingMustache(node),
    ]);
}

const printCloseBlock = (path, print, options) => {
    const { node } = path;

    if (options.htmlWhitespaceSensitivity === "ignore") {
        const escape = blockStatementHasOnlyWhitespaceInProgram(node)
          ? softline
          : hardline;

        return [
            escape,
            printClosingBlockOpeningMustache(node),
            print("path"),
            printClosingBlockClosingMustache(node),
        ];
    }

    return [
        printClosingBlockOpeningMustache(node),
        print("path"),
        printClosingBlockClosingMustache(node),
    ];
}

const isElseIfLike = (path) => {
    const { grandparent, node } = path;
    return (
      grandparent?.inverse?.body.length === 1 &&
      grandparent.inverse.body[0] === node &&
      isPathWithSameHead(grandparent.inverse.body[0].path, grandparent.path)
    );
}

const printPathExpression = (node) => {
    return node.original;
}

const printSubExpressionPathAndParams = (path, print) => {
    const printed = printPath(path, print);
    const params = printParams(path, print);

    if (!params) {
        return printed;
    }

    return indent([printed, line, group(params)]);
}

const printStencil = (path, options, print) => {
    const { node } = path;

    if (!node) {
        console.error('Node is undefined');
        return '';
    }

    switch (node.type) {
        case 'Program':
            return group(path.map(print, "body"));

        case 'ContentStatement':
            return join(line, node.original.split(/\n$/m));

        case 'MustacheStatement':
            node.triple = node.escaped === false;

            return group([
                printOpeningMustache(node),
                printPathAndParams(path, print),
                printClosingMustache(node),
            ]);

        case 'BlockStatement':
            if (isElseIfLike(path)) {
                return [
                    printElseIfLikeBlock(path, print),
                    printProgram(path, print, options),
                    printInverse(path, print, options),
                ];
            }

            return [
                printOpenBlock(path, print),
                group([
                    printProgram(path, print, options),
                    printInverse(path, print, options),
                    printCloseBlock(path, print, options),
                ]),
            ];

        case "Hash":
            return join(line, path.map(print, "pairs"));

        case "HashPair":
            return [node.key, "=", print("value")];

        case "PathExpression":
            return printPathExpression(node);

        case 'PartialStatement':
            return group([
                printOpeningPartial(node),
                printPathAndParams(path, print),
                printClosingPartial(node),
            ]);

        case 'CommentStatement':
            return `{{!--${node.value}--}}`;

        case 'StringLiteral':
            return printStringLiteral(path, options);

        case 'NumberLiteral':
            return String(node.value);

        case 'BooleanLiteral':
            return node.value ? 'true' : 'false';

        case 'UndefinedLiteral':
            return 'undefined';

        case 'NullLiteral':
            return 'null';

        case 'SubExpression':
            return group([
                "(",
                printSubExpressionPathAndParams(path, print),
                softline,
                ")",
            ]);

        default:
            throw new Error(`Unknown node type: ${node.type}`);
    }
};

export default printStencil;
