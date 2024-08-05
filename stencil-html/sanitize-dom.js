/**
 * This function replaces any handlebars replacement dangerous position with a placeholder
 * @param html
 */
const sanitizeDom = (html) => {
    const placeholders = [];
    let placeholderIndex = 0;

    // Replace <script> tags content with placeholders
    html = html.replace(/<script>([\s\S]*?)<\/script>/g, (match, p1) => {
        placeholders.push(p1);
        return `<script>___PLACEHOLDER_${placeholderIndex++}__</script>`;
    });

    // Replace mustaches in attributes with placeholders
    html = html.replace(/(\w+="[^"]*{{[^"]*}}[^"]*")/g, (match) => {
        const parts = match.split(/{{|}}/);
        placeholders.push(`{{${parts[1]}}}`);
        return match.replace(
            /{{[^"]*}}/,
            `___PLACEHOLDER_${placeholderIndex++}__`,
        );
    });

    // Replace mustaches inside tags
    html = html.replace(
        /<(\w+)\s*([^>]*)({{(.+?))>/g,
        (match, tagName, before, mustache) => {
            placeholders.push(`${before}${mustache}`);
            return `<${tagName} ___PLACEHOLDER_${placeholderIndex++}__>`;
        },
    );

    return { dom: html, placeholders };
};

export default sanitizeDom;
