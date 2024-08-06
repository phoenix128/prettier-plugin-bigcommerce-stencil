import revertParams from "./revert-params.js";

const getStripTags = (params) => {
    const res = {
        open: "",
        close: "",
    };

    if (params.includes("s=")) {
        const match = params.match(/\s+s="([^"]+)"\s*/);
        if (match) {
            if (match[1].includes("o")) {
                res.open = "~";
            }
            if (match[1].includes("c")) {
                res.close = "~";
            }
        }
    }

    return res;
};

const revertMustaches = (html) => {
    return html
        .replace(
            /<\s*hbs:b:(\S+)\s*([\s\S]*?)(\s*)>/gm,
            (match, tag, params, spaceEnd) => {
                if (spaceEnd === " ") spaceEnd = "";
                const mustacheParams = revertParams(params);
                const stripTags = getStripTags(params);
                return `{{${stripTags.open}#${tag} ${mustacheParams}${spaceEnd}${stripTags.close}}}`;
            },
        )
        .replace(/<\/\s*hbs:b:(\S+?)\s*><\s*hbs:e:(\1)\s*>/gm, (match, tag) => {
            return `{{else}}`;
        })
        .replace(/<\/\s*hbs:[be]:(\S+?)\s*>/gm, (match, tag) => {
            return `{{/${tag}}}`;
        })
        .replace(
            /<\s*hbs:p\s*([\s\S]*?)(\s*)\/>/gm,
            (match, params, spaceEnd) => {
                if (spaceEnd === " ") spaceEnd = "";
                const stripTags = getStripTags(params);
                const mustacheParams = revertParams(params);
                if (spaceEnd.includes("\n")) {
                    return `{{${stripTags.open}> ${mustacheParams}\n${stripTags.close}}}`;
                }
                return `{{${stripTags.open}> ${mustacheParams}${spaceEnd}${stripTags.close}}}`;
            },
        )
        .replace(/<\s*hbs:c\s*>/gm, "{{!--")
        .replace(/<\/hbs:c>/gm, "--}}")
        .replace(
            /<\s*hbs:m\s*([\s\S]*?)(\s*)\/>/gm,
            (match, params, spaceEnd) => {
                if (spaceEnd === " ") spaceEnd = "";
                const stripTags = getStripTags(params);
                const mustacheParams = revertParams(params);
                return `{{${stripTags.open}${mustacheParams}${spaceEnd}${stripTags.close}}}`;
            },
        )
        .replace(
            /<\s*hbs:r\s*([\s\S]*?)(\s*)\/>/gm,
            (match, params, spaceEnd) => {
                if (spaceEnd === " ") spaceEnd = "";
                const stripTags = getStripTags(params);
                const mustacheParams = revertParams(params);
                return `{{{${stripTags.open}${mustacheParams}${spaceEnd}${stripTags.close}}}}`;
            },
        );
};

export default revertMustaches;
