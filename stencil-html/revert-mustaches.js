import revertParams from "./revert-params.js";

const revertMustaches = (html) => {
    return html
        .replace(
            /<\s*hbs:block:(\S+)\s*([\s\S]*?)>/gm,
            (match, tag, params) => {
                const mustacheParams = revertParams(params);
                return `{{#${tag} ${mustacheParams}}}`;
            },
        )
        .replace(/<\/\s*hbs:block:(\S+?)\s*>/gm, (match, tag) => {
            return `{{/${tag}}}`;
        })
        .replace(
            /<\s*hbs:partial\s*([\s\S]*?)(\s*)\/>/gm,
            (match, params, spaceEnd) => {
                if (spaceEnd === " ") spaceEnd = "";
                const mustacheParams = revertParams(params);
                if (spaceEnd.includes("\n")) {
                    return `{{> ${mustacheParams}\n}}`;
                }
                return `{{> ${mustacheParams}${spaceEnd}}}`;
            },
        )
        .replace(/<\s*hbs:strip\s*(.*?)\s*\/>/gm, (match, params) => {
            const mustacheParams = revertParams(params);
            return `{{~${mustacheParams}}}`;
        })
        .replace(/<\s*hbs:if-else\s*>/gm, "")
        .replace(/<\/\s*hbs:if\s*>/gm, "")
        .replace(/<\/\s*hbs:if-else\s*>/gm, "{{/if}}")
        .replace(/<\s*hbs:if\s*([\s\S]*?)>/gm, (match, params) => {
            const mustacheParams = revertParams(params);
            return `{{#if ${mustacheParams}}}`;
        })
        .replace(/<\s*hbs:else\s*>/gm, "{{else}}")
        .replace(/<\/\s*hbs:else\s*>/gm, "")
        .replace(/<\s*hbs:comment\s*>/gm, "{{!-- ")
        .replace(/<\/hbs:comment>/gm, " --}}")
        .replace(
            /<\s*hbs:mustache\s*([\s\S]*?)(\s*)\/>/gm,
            (match, params, spaceEnd) => {
                if (spaceEnd === " ") spaceEnd = "";
                const mustacheParams = revertParams(params);
                return `{{${mustacheParams}${spaceEnd}}}`;
            },
        )
        .replace(
            /<\s*hbs:raw\s*([\s\S]*?)(\s*)\/>/gm,
            (match, params, spaceEnd) => {
                if (spaceEnd === " ") spaceEnd = "";
                const mustacheParams = revertParams(params);
                return `{{{${mustacheParams}${spaceEnd}}}}`;
            },
        );
};

export default revertMustaches;
