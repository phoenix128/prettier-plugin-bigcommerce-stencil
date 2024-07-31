import revertParams from "./revert-params.js";

const revertMustaches = (html) => {
    return html
        .replace(/<\s*hbs:block:(\S+)\s*(.*?)>/gm, (match, tag, params) => {
            const mustacheParams = revertParams(params);
            return `{{#${tag} ${mustacheParams}}}`;
        })
        .replace(/<\/hbs:block:(\S+?)\s*>/gm, (match, tag) => {
            return `{{/${tag}}}`;
        })
        .replace(/<\s*hbs:partial(\s*)([^>]*?)(\s*)\/>/gm, (match, spaceStart, params, spaceEnd) => {
            const mustacheParams = revertParams(params);
            if (spaceEnd === ' ') {
                return `{{>${spaceStart}${mustacheParams}}}`;
            }

            return `{{>${spaceStart}${mustacheParams}${spaceEnd}}}`;
        })
        .replace(/<\s*hbs:else\s*>/gm, '{{else}}')
        .replace(/<\/hbs:else>/gm, '')
        .replace(/<hbs:strip\s*(.*?)\s*\/>/gm, (match, params) => {
            const mustacheParams = revertParams(params);
            return `{{~${mustacheParams}}}`;
        })
        .replace(/<\s*hbs:comment\s*>/gm, '{{!-- ')
        .replace(/<\/hbs:comment>/gm, ' --}}')
        .replace(/<\s*hbs:mustache\s*(.*?)\s*\/>/gm, (match, params) => {
            const mustacheParams = revertParams(params);
            return `{{${mustacheParams}}}`;
        })
        .replace(/<\s*hbs:raw\s*(.*?)\s*\/>/gm, (match, params) => {
            const mustacheParams = revertParams(params);
            return `{{{${mustacheParams}}}}`;
        });
};

export default revertMustaches;
