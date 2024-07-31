import {
    printers as htmlPrinters
} from 'prettier/plugins/html';
import {builders} from "prettier/doc";

const { line, join, group, softline } = builders;

const printParams = (node, options, print) => {
    return join(line, node.attrs.map(attr => {
        if (attr.name.startsWith("_")) {
            return attr.value;
        }

        return printStencil({ node: attr }, options, print);
    }));
}

const printHbsElement = (node, options, print) => {
    const [hbsType, ...rest] = node.name.split(":");

    switch (hbsType) {
        case "partial":
            return group(["{{>", line, printParams(node), "}}"]);

        case "strip":
            return group(["{{~", line, printParams(node), "}}"]);

        case "block":
            const blockName = rest[0];
            return group([`{{#${blockName}`, line, printParams(node), "}}", line, `{{/${blockName}}}`]);

        case "mustache":
            return group(["{{", softline, printParams(node), "}}"]);
    }
}

const printStencil = (path, options, print) => {
    const { node } = path;

    switch (node.type) {
        case "element":
            if (node.namespace === 'hbs') {
                return printHbsElement(node, options, print);
            }

            return htmlPrinters.html.print(path, options, print);

    }

    return htmlPrinters.html.print(path, options, print);
}

export default printStencil;
