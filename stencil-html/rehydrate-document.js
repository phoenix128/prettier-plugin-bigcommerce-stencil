const rehydrateDocument = (html, placeholders) => {
  let rehydrated = html;
  placeholders.forEach((placeholder, index) => {
    rehydrated = rehydrated.replace(`___PLACEHOLDER_${index}__`, placeholder);
  });
  return rehydrated;
}

export default rehydrateDocument;
