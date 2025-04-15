/**
 * 用于解密Dean Edwards packer格式的混淆代码
 * 这种格式通常以 eval(function(p,a,c,k,e,d){... 开头
 */

function unpackEvil(p) {
  try {
    // 直接使用eval执行混淆代码并返回结果
    // 这种方法简单直接，但在某些环境下可能有安全风险
    return eval('(' + p + ')');
  } catch (e) {
    console.error("解密失败:", e);
    return null;
  }
}

function unpack(p) {
  // 更安全的方法，避免直接使用eval
  try {
    // 如果代码以eval开头，移除eval并直接执行函数内容
    if (p.indexOf('eval(') === 0) {
      p = p.substring(5, p.length - 1);
      
      // 使用Function构造函数代替eval
      var unpacked = new Function('return ' + p)();
      return unpacked;
    } else {
      // 如果不是以eval开头，可能已经是解包后的代码
      return p;
    }
  } catch (e) {
    console.error("解密失败:", e);
    return null;
  }
}

// 多层解包函数
function multiUnpack(code, maxLayers = 10) {
  let currentCode = code;
  let layer = 0;
  
  console.log('开始解包...');
  
  while (layer < maxLayers) {
    layer++;
    
    let prevCode = currentCode;
    console.log(`进行第 ${layer} 层解包...`);
    
    // 尝试解包
    let result = unpack(currentCode);
    
    if (!result || result === currentCode) {
      console.log(`解包完成，共 ${layer-1} 层`);
      break;
    }
    
    currentCode = result;
  }
  
  if (layer >= maxLayers) {
    console.log(`警告：已达到最大解包层数 ${maxLayers}，可能未完全解包`);
  }
  
  return currentCode;
}

// 暴露到全局
window.unpack = unpack;
window.unpackEvil = unpackEvil;
window.multiUnpack = multiUnpack;
