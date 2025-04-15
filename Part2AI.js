/**
 * Part2AI特定混淆解密器
 * 专门解密以eval(function(p,a,c,k,e,d){...开头的混淆代码
 */

function part2decode(code) {
  // 检查是否是特定格式的混淆代码
  if (!code.includes('eval(function(p,a,c,k,e,d)')) {
    console.error('不是Part2AI支持的混淆格式');
    return null;
  }
  
  try {
    // 移除eval外壳，直接执行函数内容
    code = code.replace(/^\s*eval\s*/, 'return ');
    
    // 使用Function构造函数执行代码，更安全
    const func = new Function(code);
    const result = func();
    
    return result;
  } catch (e) {
    console.error('解密失败:', e);
    return null;
  }
}

function part2encode(code) {
  // 简单的混淆实现
  return `eval(function(p,a,c,k,e,d){e=function(c){return c};if(!''.replace(/^/,String)){while(c--){d[c]=k[c]||c}k=[function(e){return d[e]}];e=function(){return'\\\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\\\b'+e(c)+'\\\\b','g'),k[c])}}return p}('${code}',${code.length},${code.length},'${[...Array(code.length)].map((_, i) => i).join('|')}'.split('|'),0,{}))`;
}

// 导出函数，使其可以在全局范围内使用
if (typeof window !== 'undefined') {
  window.part2decode = part2decode;
  window.part2encode = part2encode;
}
