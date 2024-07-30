const processOutput = (output, options) => {
    return output
        .replaceAll(/\n{3,}/gm, "\n\n") // Collapse multiple newlines
        .replaceAll(/[^\S\r\n]+(?=\r?\n|$)/gm, ''); // Remove trailing whitespace
}

export default processOutput;
