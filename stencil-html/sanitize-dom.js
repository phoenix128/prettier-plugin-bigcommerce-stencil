import { parseDocument } from "htmlparser2";
import convertMustaches from "./convert-mustaches.js";
import domSerializer from "dom-serializer";

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
    return match.replace(/{{[^"]*}}/, `___PLACEHOLDER_${placeholderIndex++}__`);
  });

  // Replace mustaches inside tags
  html = html.replace(/<(\w+)\s*([^>]*)({{(.+?))>/g, (match, tagName, before, mustache) => {
    placeholders.push(`${before}${mustache}`);
    return `<${tagName} ___PLACEHOLDER_${placeholderIndex++}__>`;
  });

  return { dom: html, placeholders };
  //
  //
  // const placeholders = [];
  // const dom = parseDocument(html, { recognizeSelfClosing: true });
  //
  // const traverseAndProcessDom = (node) => {
  //   if (node.type === 'text') { // Skip text nodes as they are supposed to be safe
  //     return;
  //   }
  //
  //   // Avoid touching script tags
  //   if (node.tagName === 'script') {
  //     const nodeData = node.children.map(child => child.data).join('');
  //     node.children = [{ type: 'text', data: `___PLACEHOLDER_${placeholders.length}__` }];
  //     placeholders.push(nodeData);
  //   }
  //
  //   // Avoid touching tag attributes
  //   if (node.attribs) {
  //     Object.keys(node.attribs).forEach((attr) => {
  //       const attrValue = node.attribs[attr];
  //       if (attrValue.includes('{{')) {
  //         node.attribs[attr] = `___PLACEHOLDER_${placeholders.length}__`;
  //         placeholders.push(attrValue);
  //       }
  //     });
  //   }
  //
  //
  //   node.children.forEach(traverseAndProcessDom);
  // };
  //
  // dom.children.forEach(traverseAndProcessDom);
  //
  // return {
  //   dom: domSerializer(dom, { xmlMode: true, decodeEntities: false }),
  //   placeholders
  // };
}

export default sanitizeDom;
