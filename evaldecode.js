/**
 * Part2AI JavaScript Unpacker
 * 浏览器版本 - 依赖Babel Standalone
 */

// 确保Babel已加载
if (typeof Babel === 'undefined') {
  const babelScript = document.createElement('script');
  babelScript.src = 'https://unpkg.com/@babel/standalone/babel.min.js';
  babelScript.async = true;
  document.head.appendChild(babelScript);
}

// 等待Babel加载完成
function waitForBabel(callback) {
  if (typeof Babel !== 'undefined') {
    callback();
  } else {
    setTimeout(() => waitForBabel(callback), 100);
  }
}

// 初始化函数
function initPart2AI() {
  // Babel解析和生成函数的包装
  const parse = function(code, options) {
    try {
      return Babel.transform(code, { 
        ast: true,
        code: false,
        ...options
      }).ast;
    } catch (e) {
      console.error("解析错误:", e);
      return null;
    }
  };

  const generate = function(ast, options) {
    try {
      return Babel.transformFromAst(ast, "", options).code;
    } catch (e) {
      console.error("生成代码错误:", e);
      return null;
    }
  };

  // 辅助函数判断节点类型
  const t = {
    isEmptyStatement: function(node) {
      return node?.type === 'EmptyStatement';
    },
    isCallExpression: function(node) {
      return node?.type === 'CallExpression';
    },
    expressionStatement: function(expression) {
      return {
        type: 'ExpressionStatement',
        expression: expression
      };
    },
    blockStatement: function(body) {
      return {
        type: 'BlockStatement',
        body: body
      };
    },
    functionExpression: function(id, params, body) {
      return {
        type: 'FunctionExpression',
        id: id,
        params: params || [],
        body: body
      };
    }
  };

  // 解包函数
  function unpack(code) {
    try {
      let ast = parse(code, { errorRecovery: true });
      if (!ast) return null;
      
      let lines = ast.program.body;
      let data = null;
      
      for (let line of lines) {
        if (t.isEmptyStatement(line)) {
          continue;
        }
        if (data) {
          return null;
        }
        if (
          t.isCallExpression(line?.expression) &&
          line.expression.callee?.name === 'eval' &&
          line.expression.arguments.length === 1 &&
          t.isCallExpression(line.expression.arguments[0])
        ) {
          data = t.expressionStatement(line.expression.arguments[0]);
          continue;
        }
        return null;
      }
      
      if (!data) {
        return null;
      }
      
      code = generate(data, { minified: true });
      if (!code) return null;
      
      // 安全执行eval
      let result;
      try {
        // 使用Function构造函数替代直接eval，增加安全性
        const evalFunc = new Function('return ' + code);
        result = evalFunc();
      } catch (e) {
        console.error("执行解包代码错误:", e);
        return null;
      }
      
      return result;
    } catch (e) {
      console.error("解包过程错误:", e);
      return null;
    }
  }

  // 打包函数
  function pack(code) {
    try {
      let ast1 = parse('(function(){}())');
      let ast2 = parse(code);
      
      if (!ast1 || !ast2) return null;
      
      // 简化版的traverse替代
      const functionExpressionNode = ast1.program.body[0].expression.callee;
      if (functionExpressionNode.type === 'FunctionExpression') {
        const body = t.blockStatement(ast2.program.body);
        functionExpressionNode.body = body;
      }
      
      code = generate(ast1, { minified: false });
      return code;
    } catch (e) {
      console.error("打包错误:", e);
      return null;
    }
  }

  // 多层解包函数
  function multiLayerUnpack(code, maxLayers = 10) {
    let currentCode = code;
    let layer = 0;
    
    console.log('开始解包...');
    
    while (layer < maxLayers) {
      layer++;
      
      let prevCode = currentCode;
      let result = unpack(currentCode);
      
      if (result === null) {
        console.log(`解包完成，共 ${layer-1} 层`);
        break;
      }
      
      currentCode = result;
      console.log(`进行第 ${layer} 层解包...`);
      
      // 如果代码没有变化，结束解包
      if (prevCode === currentCode) {
        console.log(`解包完成，共 ${layer-1} 层`);
        break;
      }
    }
    
    if (layer >= maxLayers) {
      console.log(`警告：已达到最大解包层数 ${maxLayers}，可能未完全解包`);
    }
    
    return currentCode;
  }

  // 将函数暴露给全局作用域
  window.part2ai = {
    unpack,
    pack,
    multiLayerUnpack
  };

  // 返回API
  return {
    unpack,
    pack,
    multiLayerUnpack
  };
}

// 在文档加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    waitForBabel(initPart2AI);
  });
} else {
  waitForBabel(initPart2AI);
}
