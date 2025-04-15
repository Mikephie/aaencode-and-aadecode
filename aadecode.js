/*
 * AAEncode 解码器 - Web前端版
 * 功能：自动检测、提取、递归解码
 * 仅适用于浏览器环境
 */

(function(global) {
  // 检测是否为 AAEncode 混淆代码
  function isAAEncode(code) {
    return /ﾟωﾟﾉ\s*=/.test(code) && /(ﾟДﾟ|ﾟΘﾟ)/.test(code) && /(function|\['_'\]|\(ﾟДﾟ\))/.test(code);
  }

  // 提取最终字符串
  function extractFinalString(code) {
    const patterns = [
      /\(ﾟДﾟ\)\s*\[\s*['_']\s*\]\s*\(\s*['"]([\s\S]+?)['"]\s*\)/,
      /\(['"]([^'"]+)['"]\)\s*;?\s*$/
    ];
    for (const pattern of patterns) {
      const match = code.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  }

  // 解码核心逻辑
  function unpack(code) {
    const str = extractFinalString(code);
    if (str) return str;

    let result = '';
    const fakeEval = function(inner) {
      result = inner;
      return inner;
    };

    let modifiedCode = code.replace(/eval\s*\(/g, 'fakeEval(')
                           .replace(/\(ﾟДﾟ\)\s*\[\s*['_']\s*\]\s*\(/g, 'fakeEval(');

    try {
      eval(modifiedCode);
      return result || code;
    } catch (e) {
      console.warn('[AAEncode] 执行失败:', e);
      return code;
    }
  }

  // 递归解码
  function recursiveUnpack(code, depth = 0) {
    if (depth > 10) return code;
    console.log(`[AAEncode] 正在递归第 ${depth + 1} 层解码...`);
    const res = unpack(code);
    if (res && res !== code && isAAEncode(res)) {
      return recursiveUnpack(res, depth + 1);
    }
    return res;
  }

  // 对外暴露的主函数
  function decodeAAencode(code) {
    if (!code || typeof code !== 'string' || !isAAEncode(code)) {
      return code;
    }
    console.log('[AAEncode] 检测到 AAEncode 混淆，开始解码...');
    return recursiveUnpack(code);
  }

  // 挂载到全局
  global.decodeAAencode = decodeAAencode;
})(window);
