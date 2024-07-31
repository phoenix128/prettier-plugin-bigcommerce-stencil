import generateParams from "./generate-params.js";

const tokenize = (text) => {
  const regex = /({{#\s*(\S+)([^}]*)}}|{{\/\s*(\S+)\s*}}|{{else}}|{{>\s*(.+?)\s*}}|{{~\s*([^}]+?)\s*}}|{{!--([\s\S]*?)--}}|{{![^}]*}}|{{{\s*(.+?)\s*}}}|{{\s*(.+?)\s*}})/gm;
  const tokens = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({
        type: 'text',
        value: text.slice(lastIndex, match.index)
      });
    }

    if (match[2]) {
      tokens.push({
        type: 'openBlock',
        tag: match[2],
        params: match[3].trim()
      });
    } else if (match[4]) {
      tokens.push({
        type: 'closeBlock',
        tag: match[4]
      });
    } else if (match[0] === '{{else}}') {
      tokens.push({
        type: 'else'
      });
    } else if (match[5]) {
      tokens.push({
        type: 'partial',
        params: match[5].trim()
      });
    } else if (match[6]) {
      tokens.push({
        type: 'strip',
        params: match[6].trim()
      });
    } else if (match[7]) {
      tokens.push({
        type: 'comment',
        value: match[7].trim()
      });
    } else if (match[0].startsWith('{{!')) {
      tokens.push({
        type: 'comment',
        value: match[0].slice(3, -2).trim()
      });
    } else if (match[8]) {
      tokens.push({
        type: 'raw',
        params: match[8].trim()
      });
    } else if (match[9]) {
      tokens.push({
        type: 'mustache',
        params: match[9].trim()
      });
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push({
      type: 'text',
      value: text.slice(lastIndex)
    });
  }

  return tokens;
};

const parse = (tokens) => {
  const root = { type: 'root', children: [] };
  const stack = [root];

  tokens.forEach(token => {
    const current = stack[stack.length - 1];

    switch (token.type) {
      case 'text':
        current.children.push(token);
        break;
      case 'openBlock':
        const block = { type: 'block', tag: token.tag, params: token.params, children: [] };
        current.children.push(block);
        stack.push(block);
        break;
      case 'closeBlock':
        while (stack.length > 1) {
          const last = stack.pop();
          if (last.tag === token.tag) break;
        }
        break;
      case 'else':
        const elseBlock = { type: 'else', children: [] };
        current.children.push(elseBlock);
        stack.push(elseBlock);
        break;
      case 'partial':
        current.children.push({ type: 'partial', params: token.params });
        break;
      case 'strip':
        current.children.push({ type: 'strip', params: token.params });
        break;
      case 'comment':
        current.children.push({ type: 'comment', value: token.value });
        break;
      case 'raw':
        current.children.push({ type: 'raw', params: token.params });
        break;
      case 'mustache':
        current.children.push({ type: 'mustache', params: token.params });
        break;
      default:
        throw new Error(`Unknown token type: ${token.type}`);
    }
  });

  return root;
};

const convertToHtml = (node) => {
  if (node.type === 'text') {
    return node.value;
  }

  if (node.type === 'block') {
    const params = generateParams(node.params);
    const children = node.children.map(convertToHtml).join('');
    return `<hbs:block:${node.tag} ${params}>${children}</hbs:block:${node.tag}>`;
  }

  if (node.type === 'else') {
    const children = node.children.map(convertToHtml).join('');
    return `<hbs:else>${children}</hbs:else>`;
  }

  if (node.type === 'partial') {
    const params = generateParams(node.params);
    return `<hbs:partial ${params} />`;
  }

  if (node.type === 'strip') {
    const params = generateParams(node.params);
    return `<hbs:strip ${params} />`;
  }

  if (node.type === 'comment') {
    return `<hbs:comment>${node.value}</hbs:comment>`;
  }

  if (node.type === 'raw') {
    const params = generateParams(node.params);
    return `<hbs:raw ${params} />`;
  }

  if (node.type === 'mustache') {
    const params = generateParams(node.params);
    return `<hbs:mustache ${params} />`;
  }

  if (node.type === 'root') {
    return node.children.map(convertToHtml).join('');
  }

  throw new Error(`Unknown node type: ${node.type}`);
};

const convertMustaches = (text) => {
  const tokens = tokenize(text);
  const rootNode = parse(tokens);
  return convertToHtml(rootNode);
};

export default convertMustaches;
