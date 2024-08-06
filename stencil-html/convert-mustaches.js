import { parse } from "@handlebars/parser";

/**
 * Generate a string of parameters
 * Params starting with __ are quoted
 * Params starting with _ are not quoted
 * @return {string}
 * @param node
 * @param includePath
 */
const generateParams = (node, includePath = false) => {
    const res = [];
    if (node.path && includePath) {
        res.push(`_0="${node.path.original}"`);
    } else if (node.name && includePath) {
        res.push(`_0="${node.name.original}"`);
    }

    if (node.params) {
        res.push(
            ...node.params.map((param, index) => {
                const key = index + 1;
                const value = param.original;

                if (param.type === "SubExpression") {
                    const subExpr = `(${param.path.original} ${param.params
                        .map((p) => {
                            if (p.type === "StringLiteral") {
                                return `"${p.original.replace(/"/g, "&quot;")}"`;
                            }
                            return p.original;
                        })
                        .join(" ")})`;
                    return `_${key}="${subExpr.replace(/"/g, "&quot;")}"`;
                }

                const isQuoted = param.type === "StringLiteral";
                if (isQuoted) {
                    return `__${key}="${value.replace(/"/g, "&quot;")}"`;
                }

                return `_${key}="${value}"`;
            }),
        );
    }

    if (node.hash) {
        res.push(
            ...node.hash.pairs.map((pair) => {
                const key = pair.key;
                const value = pair.value.original;

                if (pair.value.type === "SubExpression") {
                    const subExpr = convertToHbs(pair.value);
                    return `_${key}="${subExpr}"`;
                }

                const isQuoted = pair.value.type === "StringLiteral";
                if (isQuoted) {
                    return `__${key}="${value.replace(/"/g, "&quot;")}"`;
                }

                return `_${key}="${value}"`;
            }),
        );
    }

    const stripTags = [];
    if (node.strip?.open) stripTags.push("o");
    if (node.strip?.close) stripTags.push("c");

    if (stripTags.length > 0) {
        res.push(`s="${stripTags.join("")}"`);
    }

    return res.length > 0 ? " " + res.join(" ") : "";
};

const convertToHbs = (node) => {
    switch (node.type) {
        case "ContentStatement":
            return node.original;

        case "BlockStatement":
            const blockParams = generateParams(node);
            if (node.inverse?.body?.length > 0) {
                const ifChildren = node.program.body.map(convertToHbs).join("");
                const elseChildren = node.inverse.body
                    .map(convertToHbs)
                    .join("");
                return `<hbs:b:${node.path.original}${blockParams}>${ifChildren}</hbs:b:${node.path.original}><hbs:e:${node.path.original}>${elseChildren}</hbs:e:${node.path.original}>`;
            } else {
                const children = node.program.body.map(convertToHbs).join("");
                return `<hbs:b:${node.path.original}${blockParams}>${children}</hbs:b:${node.path.original}>`;
            }

        case "ElseStatement":
            return "";

        case "PartialStatement":
            const partialParams = generateParams(node, true);
            return `<hbs:p${partialParams} />`;

        case "CommentStatement":
            return `<hbs:c>${node.value}</hbs:c>`;

        case "MustacheStatement":
            const mustacheParams = generateParams(node, true);
            if (node.escaped) {
                return `<hbs:m${mustacheParams} />`;
            }

            return `<hbs:r${mustacheParams} />`;

        case "SubExpression":
            const subExprParams = generateParams(node);
            return `(${node.path.original}${subExprParams})`;

        case "Program":
            return node.body.map(convertToHbs).join("");

        default:
            throw new Error(`Unknown node type: ${node.type}`);
    }
};

const convertMustaches = (hbsTemplate) => {
    const ast = parse(hbsTemplate);
    return convertToHbs(ast);
};

export default convertMustaches;
