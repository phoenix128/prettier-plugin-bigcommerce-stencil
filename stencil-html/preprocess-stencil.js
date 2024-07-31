import convertMustaches from "./convert-mustaches.js";
import sanitizeDom from "./sanitize-dom.js";
import rehydrateDocument from "./rehydrate-document.js";

/**
 * Replace mustache tags with custom tags, so HTML hierarchy is preserved.
 */
const preProcessHbs = (text, options) => {
    const { dom, placeholders } = sanitizeDom(text);
    const hbsDom = convertMustaches(dom);
    return rehydrateDocument(hbsDom, placeholders);
}

const preprocessStencil = (text, options) => {
    return preProcessHbs(text, options);
}

export default preprocessStencil;
