import md5 from "md5";
import parseAttributes from "./parse-attributes.js";

const generateParams = (tagParams) => {
  const attrs = parseAttributes(tagParams);
  return attrs.map((attr, index) => {
    if (Array.isArray(attr)) {
      return `${attr[0]}="${attr[1].replaceAll('"', '&quot;')}"`;
    }
    return `_${index}="${attr.replaceAll('"', '&quot;')}"`;
  }).join(' ');
};

const generateTagId = (name, index) => {
  return md5(name + index).slice(0, 8);
};

const convertMustaches = (text) => {
  const blockHelpers = [];
  let currentIndex = 0;

  const handleBlockHelpers = (match, tag, tagParams, body) => {
    const id = generateTagId(tag, currentIndex++);
    blockHelpers.push({
      id,
      tag,
      tagParams,
      body: convertMustaches(body)
    });
    return `BLOCK_HELPER_${id}`;
  };

  const handleIfElse = (match, condition, ifBody, elseBody) => {
    return `<hbs:if-else>` +
      `<hbs:if ${generateParams(condition)}>${convertMustaches(ifBody)}</hbs:if>` +
      `<hbs:else>${convertMustaches(elseBody)}</hbs:else>` +
      `</hbs:if-else>`;
  };

  // Handle if-else separately to correctly process the else block
  text = text.replace(/{{#\s*if\s*(.+?)\s*}}([\s\S]*?){{else}}([\s\S]*?){{\/if\s*}}/gm, handleIfElse);

  // Extract and handle block helpers
  text = text.replace(/{{#\s*([^}\s]+)([^}]*)}}([\s\S]*?){{\/\1}}/gm, handleBlockHelpers);

  // Handle other mustache types
  text = text
    .replace(/{{>\s*(.+?)\s*}}/gm, (match, tagParams) => {
      return `<hbs:partial ${generateParams(tagParams)} />`;
    })
    .replace(/{{~\s*([^}]+?)\s*}}/gm, (match, tagParams) => {
      return `<hbs:strip ${generateParams(tagParams)} />`;
    })
    .replace(/{{!--([\s\S]*?)--}}/gm, (match, comment) => {
      return `<hbs:comment>${comment.trim()}</hbs:comment>`;
    })
    .replace(/{{![^}]*}}/gm, (match) => {
      return `<hbs:comment>${match.slice(3, -2).trim()}</hbs:comment>`;
    })
    .replace(/{{{\s*(.+?)\s*}}}/gm, (match, tagParams) => {
      return `<hbs:raw ${generateParams(tagParams)} />`;
    })
    .replace(/{{\s*(.+?)\s*}}/gm, (match, tagParams) => {
      return `<hbs:mustache ${generateParams(tagParams)} />`;
    });

  // Replace block helper placeholders with actual content
  blockHelpers.forEach(helper => {
    const blockTag = `<hbs:block:${helper.tag} ${generateParams(helper.tagParams)}>${helper.body}</hbs:block:${helper.tag}>`;
    text = text.replace(`BLOCK_HELPER_${helper.id}`, blockTag);
  });

  return text;
};

export default convertMustaches;
