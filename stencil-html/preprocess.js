import prettier from "prettier"

const removeIndent = (text) => {
    return text.split('\n').map(t => t.trimStart()).join('\n');
}

const preProcessHbs = async (text, options) => {
    const noIndent = removeIndent(text);

    // Replace partials with a temporary placeholder
    const r = noIndent.replace(/{{> ([^}]+)}}/g, (match, p1) => {
        return `{{$ ${p1.replace(/\//g, '_')}}}`;
    });

    return prettier.format(r, {
        parser: 'glimmer',
        ...options,
        preserveNewlines: true,
        bracketSpacing: false,
        bracketSameLine: true,
    });

    return prettier.format(noIndent, {
        parser: 'html',
        ...options,
        htmlWhitespaceSensitivity: 'css',
        preserveNewlines: true,
        bracketSpacing: false,
        bracketSameLine: true,
    });
}

const preprocess = async (text, options) => {
    if (text.startsWith('---')) {
        const [_, heading, hbs] = text.split(/^---\n/m);
        return '---\n' + heading + '---\n' + await preProcessHbs(hbs, options);
    }

    return await preProcessHbs(text);
}

export default preprocess;
