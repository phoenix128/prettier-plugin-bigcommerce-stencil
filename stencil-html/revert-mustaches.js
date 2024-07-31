const convertParams = (params) => {
  return params.replace(/(\S+)="([^"]*)"/g, (match, key, value) => {
    if (key.startsWith('_')) {
      return value;
    }
    return `${key}=${value.replace(/&quot;/g, '"')}`;
  });
};

const revertMustaches = (html) => {
  return html
    .replace(/<\s*hbs:block:(\S+)\s*(.*?)>/gms, (match, tag, params) => {
      const mustacheParams = convertParams(params);
      return `{{#${tag} ${mustacheParams}}}`;
    })
    .replace(/<\/hbs:block:(\S+)\s*>/gms, (match, tag) => {
      return `{{/${tag}}}`;
    })
    .replace(/<\s*hbs:else\s*>/gms, '{{else}}')
    .replace(/<\/hbs:else>/gms, '')
    .replace(/<hbs:partial\s*(.*?)\s*\/>/gms, (match, params) => {
      const mustacheParams = convertParams(params);
      return `{{> ${mustacheParams}}}`;
    })
    .replace(/<hbs:strip\s*(.*?)\s*\/>/gms, (match, params) => {
      const mustacheParams = convertParams(params);
      return `{{~ ${mustacheParams}}}`;
    })
    .replace(/<\s*hbs:comment\s*>/gms, '{{!-- ')
    .replace(/<\/hbs:comment>/gms, ' --}}')
    .replace(/<\s*hbs:mustache\s*(.*?)\s*\/>/gms, (match, params) => {
      const mustacheParams = convertParams(params);
      return `{{${mustacheParams}}}`;
    })
    .replace(/<\s*hbs:raw\s*(.*?)\s*\/>/gms, (match, params) => {
      const mustacheParams = convertParams(params);
      return `{{{${mustacheParams}}}}`;
    });
};

export default revertMustaches;
