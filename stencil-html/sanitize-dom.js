function sanitizeDom(html) {
    let placeholders = [];
    let placeholderIndex = 0;

    function createPlaceholder(content) {
        placeholders.push(content);
        return `___PLACEHOLDER_${placeholderIndex++}__`;
    }

    // Replace script tag content
    html = html.replace(
        /<\s*script[^>]*>([\s\S]*?)<\s*\/\s*script\s*>/gi,
        (match, p1) => {
            const placeholder = createPlaceholder(p1);
            return match.replace(p1, placeholder);
        },
    );

    const tagRegex = /<\s*([\w-]+)\s*((?:({{.+?}})|[^>])*?)>/g;
    const tagsWithHbs =
        html.match(tagRegex)?.filter((tag) => tag.includes("{{")) || [];

    // Replace attributes with mustaches
    tagsWithHbs.forEach((tagMatch) => {
        // Replace mustaches with placeholders
        const mustaches = tagMatch.match(/{{.+?}}/g);
        mustaches.forEach((mustache) => {
            const placeholder = createPlaceholder(mustache);
            html = html.replace(mustache, placeholder);
        });
    });

    return { dom: html, placeholders };
}

export default sanitizeDom;
