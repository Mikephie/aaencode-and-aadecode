/**
 * Part2AI JavaScript Unpacker
 * 纯JavaScript实现，不依赖任何外部库
 */

// 解包函数 - 类似于aadecode的简单形式
function part2unpack(code) {
  // 检查是否含有eval调用
  if (!code.includes("eval(")) {
    return null;
  }
  
  try {
    // 提取eval中的内容
    let match = code.match(/eval\s*\(\s*(function\s*\([^)]*\)\s*\{[\s\S]*?\}|[^)]+)\s*\)/);
    if (!match) {
      return null;
    }
    
    let innerCode = match[1];
    
    // 如果内部代码是函数调用，获取函数调用结果
    if (innerCode.includes("(function") && innerCode.includes("return")) {
      // 使用Function构造函数替代eval，增加安全性
      let func = new Function('return ' + innerCode);
      return func();
    } else {
      // 尝试简单地执行内部代码
      let func = new Function('return ' + innerCode);
      return func();
    }
  } catch (e) {
    console.error("解包失败:", e);
    return null;
  }
}

// 打包函数 - 将代码包装在自执行函数中
function part2pack(code) {
  try {
    // 简单地将代码包装在自执行函数中
    return '(function(){' + code + '})()';
  } catch (e) {
    console.error("打包失败:", e);
    return null;
  }
}

// 多层解包函数 - 自动进行多层解包
function part2multiUnpack(code, maxLayers = 10) {
  let currentCode = code;
  let layer = 0;
  let log = '';
  
  log += '输入: code\n';
  
  while (layer < maxLayers) {
    layer++;
    
    let prevCode = currentCode;
    log += `进行第 ${layer} 层解包...\n`;
    
    let result = part2unpack(currentCode);
    
    if (result === null) {
      log += `解包完成，共 ${layer-1} 层\n`;
      break;
    }
    
    currentCode = result;
    
    // 如果代码没有变化，结束解包
    if (prevCode === currentCode) {
      log += `解包完成，共 ${layer-1} 层\n`;
      break;
    }
  }
  
  if (layer >= maxLayers) {
    log += `警告：已达到最大解包层数 ${maxLayers}，可能未完全解包\n`;
  }
  
  log += '输出: code\n';
  console.log(log);
  
  return currentCode;
}
