const revertParams = (params) => {
    const regex =
        /(?<underscores>_+)(?<key>\w+)=(?<quote>["'])(?<value>(?:\\\3|.)*?)\3(?<spaceEnd>\s*)/g;

    const matches = Array.from(params.matchAll(regex));
    if (!matches) {
        return "";
    }

    return matches.map(processMatch).join("").trim();
};

const processMatch = (match) => {
    const { underscores, key, value, spaceEnd, quote } = match.groups;
    const unescapedValue = unescapeValue(value);

    if (isNumericKey(key)) {
        return formatParam(underscores, unescapedValue, quote) + spaceEnd;
    }

    return (
        formatHashedParam(underscores, key, unescapedValue, quote) + spaceEnd
    );
};

const unescapeValue = (value) => {
    return value.replaceAll("&quot;", '\\"');
};

const isNumericKey = (key) => {
    return key.match(/^\d+$/);
};

const formatParam = (underscores, value, quote) => {
    return underscores.length > 1 ? `${quote}${value}${quote}` : value;
};

const formatHashedParam = (underscores, key, value, quote) => {
    return underscores.length > 1
        ? `${key}=${quote}${value}${quote}`
        : `${key}=${value}`;
};

export default revertParams;
