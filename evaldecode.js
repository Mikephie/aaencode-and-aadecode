function unpack(code) {
  try {
    // Basic pattern detection for eval(function_call())
    const evalPattern = /eval\((function|[\w$_]+)\(/;
    if (!evalPattern.test(code)) {
      return null;
    }
    
    // Extract the function call inside eval
    const innerCode = code.replace(/^\s*eval\((.+)\)[\s;]*$/, "$1");
    
    // Create and execute a function that returns the inner code
    const extractFunc = new Function(`return ${innerCode}`);
    const extracted = extractFunc();
    
    return extracted;
  } catch (e) {
    console.error("Unpacking failed:", e);
    return null;
  }
}

function pack(code) {
  try {
    // Create a self-executing function wrapper
    const wrapped = `(function(){${code}})()`;
    return wrapped;
  } catch (e) {
    console.error("Packing failed:", e);
    return null;
  }
}

// Export for web use
const BabelUnpacker = {
  unpack,
  pack
};

// For direct browser use without import/export
if (typeof window !== 'undefined') {
  window.BabelUnpacker = BabelUnpacker;
}

// For CommonJS environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BabelUnpacker;
}
