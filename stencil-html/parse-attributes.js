const parseAttributes = (attributeString) => {
  const result = [];
  let currentKey = '';
  let currentValue = '';
  let inQuotes = false;
  let quoteChar = '';
  let isKey = true;
  let escapeNext = false;

  // Loop through each character in the attribute string
  for (let i = 0; i < attributeString.length; i++) {
    const char = attributeString[i];

    // Handle escape characters
    if (escapeNext) {
      currentValue += char;
      escapeNext = false;
    } else if (char === '\\') {
      escapeNext = true;
    } else if (inQuotes) {
      // Handle quoted values
      if (char === quoteChar) {
        inQuotes = false;
        if (isKey) {
          currentKey = currentValue;
        } else {
          result.push([currentKey, currentValue]);
          currentKey = '';
        }
        currentValue = '';
        isKey = true;
      } else {
        currentValue += char;
      }
    } else {
      // Handle non-quoted characters
      if (char === '"' || char === "'") {
        inQuotes = true;
        quoteChar = char;
      } else if (char === '=') {
        isKey = false;
      } else if (char === ' ' || char === '\n') {
        if (currentKey) {
          if (currentValue) {
            result.push([currentKey, currentValue]);
          } else {
            result.push(currentKey);
          }
        } else if (currentValue) {
          result.push(currentValue);
        }
        currentKey = '';
        currentValue = '';
        isKey = true;
      } else {
        if (isKey) {
          currentKey += char;
        } else {
          currentValue += char;
        }
      }
    }
  }

  // Handle the last key-value pair or value if present
  if (currentKey) {
    if (currentValue) {
      result.push([currentKey, currentValue]);
    } else {
      result.push(currentKey);
    }
  } else if (currentValue) {
    result.push(currentValue);
  }

  return result;
}

export default parseAttributes;
