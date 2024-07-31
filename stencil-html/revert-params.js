const revertParams = (params) => {
    const regex = /(_+)(\w+)="((?:[^"\\]|\\.)*)"|\S+/g;
    let result = '';
    let lastIndex = 0;

    while (true) {
        const match = regex.exec(params);
        if (!match) break;

        result += preserveSpacing(params, lastIndex, match.index);
        result += processMatch(match);
        lastIndex = regex.lastIndex;
    }

    result += params.slice(lastIndex);
    return result;
};

const preserveSpacing = (params, start, end) => {
    return params.slice(start, end);
};

const processMatch = (match) => {
    if (!match[1]) return match[0];

    const [, underscores, key, value] = match;
    const unescapedValue = unescapeValue(value);

    if (isNumericKey(key)) {
        return formatNumericParam(underscores, unescapedValue);
    } else {
        return formatNamedParam(underscores, key, unescapedValue);
    }
};

const unescapeValue = (value) => {
    return value.replaceAll('&quot;', '\\"');
};

const isNumericKey = (key) => {
    return key.match(/^\d+$/);
};

const formatNumericParam = (underscores, value) => {
    return underscores.length > 1 ? `"${value}"` : value;
};

const formatNamedParam = (underscores, key, value) => {
    return underscores.length > 1 ? `${key}="${value}"` : `${key}=${value}`;
};

export default revertParams;
