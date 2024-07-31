import parseAttributes from "./parse-attributes.js";

/**
 * Generate a string of parameters from a tag's attributes
 * Params starting with __ are quoted
 * Params starting with _ are not quoted
 * @param tagParams
 * @return {string}
 */
const generateParams = (tagParams) => {
    const attrs = parseAttributes(tagParams);

    let paramsCount = 0;
    return attrs.map((attr, index) => {
        const value = Array.isArray(attr) ? attr[1] : attr;
        const isParam = !Array.isArray(attr);

        // Parse attributes returns normalized double quotes
        const hasQuotes = value.startsWith('"');

        const key = isParam ? paramsCount++ : attr[0];

        if (hasQuotes) {
            return `__${key}=${value}`;
        }

        return `_${key}="${value}"`;
    }).join(' ');
};

export default generateParams;
