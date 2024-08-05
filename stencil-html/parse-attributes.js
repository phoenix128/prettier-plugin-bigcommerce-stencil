export default function parseAttributes(attributeString) {
    const result = [];
    const regex =
        /([^\s"'=]+)\s*=\s*("[^"]*"|'[^']*'|[^\s"']+)|(?:"[^"]*"|'[^']*'|[^\s"']+)/g;
    let match;

    while ((match = regex.exec(attributeString)) !== null) {
        if (match[1]) {
            // Key-value pair
            const key = match[1];
            let value = match[2];

            // Handle mixed quotes within single quotes
            if (value.startsWith("'") && value.includes('"')) {
                value = `"${value.slice(1, -1).replace(/"/g, "&quot;")}"`;
            } else if (value.startsWith("'")) {
                // Convert single quotes to double quotes
                value = `"${value.slice(1, -1)}"`;
            }

            result.push([key, value]);
        } else {
            // Single parameter
            let param = match[0];

            // Convert single quotes to double quotes for parameters
            if (param.startsWith("'") && param.endsWith("'")) {
                param = `"${param.slice(1, -1)}"`;
            }

            result.push(param);
        }
    }

    return result;
}
