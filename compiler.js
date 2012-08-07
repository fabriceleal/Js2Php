(function(){

	var auxDispatchToValue = function(is_top_level){ return function(expr){ return expr.value ? compile(is_top_level)(expr.value) : ''; }};
	var auxJsonStringify = function(is_top_level){ return function(expr){ return JSON.stringify(expr.value);}};

	var compilers = {
		'id' : function(is_top_level){
			return function(expr){
				if(is_top_level === true) console.warn('id does not support is_top_level === true');

				return '$' + expr.name;
			};
		},
		'varStatement' : function(is_top_level){
			return function(expr){
				if(is_top_level === false) console.warn('varStatement does not support is_top_level === false');

				/*
				 Var Statement can hold several vars. Php doesnt have var declaration, 
				so we will generate instructions to init them to null
				*/

				var ret = expr.value.map(function(d){
					return compile(false)(d.name) + ' = ' + (d.init ? compile(false)(d.init) : 'null') + ';\n';
				}).join('');

				return ret;
			}
		},
		// Just dispatch to the value ...
		'expression': auxDispatchToValue,
		'literal'	: auxDispatchToValue,
		'arguments' : function(is_top_level){
			return function(expr){
				if(expr.value){
					return expr.value.map(compile(false)).join(', ');
				}
				return '';
			};
		},
		'assignment': function(is_top_level){
			return function(expr){
				return compile(false)(expr.left) + ' ' + expr.operator + ' ' + compile(false)(expr.right) + (is_top_level ? ';\n' : '');
			};
		},
		'string_literal': auxJsonStringify,
		'number_literal': auxJsonStringify,
		'call': function(is_top_level){
			return function(expr){
				return compile(false)(expr.head) + '(' + compile(false)(expr.args) + ')' + (is_top_level ? ';\n' : ''); 
			}
		},
		'memberExpressionPartDot' : function(is_top_level){
			return function(expr){
				if(expr.value.tag !== 'id') console.err('memberExpressionPartDot does not support values with tag ' + expr.value.tag);

				return '->' + expr.value.name;
			};
		},
		'memberExpr': function(is_top_level){
			return function(expr){
				return compile(false)(expr.head) + expr.value.map(compile(false));
			};
		},
		'add' : function(is_top_level){
			return function(expr){				
				if(expr.op === '+'){
					return 'add(' + compile(false)(expr.left) + ', ' + compile(false)(expr.right) + ')';
				}
				
				return compile(false)(expr.left) + ' ' + expr.op + ' ' + compile(false)(expr.right);
			};
		}
	};

	var compile = function(is_top_level){
		return function(expr){
			if(expr instanceof Array){
				return expr.map(compile(true)).join('');
			}
			var $ = compilers[expr.tag];
			if($)
				return $(is_top_level)(expr);
			else{
				console.warn('Compilation does not support: ' + expr.tag);
				return '';
			}
		}
	};

	var compileToPhp = function(expr){
		var ret = '<?\n';

		// Add headers
		['JsObject.php', 'JsConsole.php', 'JsFunction.php', 'JsAdd.php'].forEach(function(item){
			ret += 'require_once "' + item + '";\n';
		});
		
		// Compile code
		ret += compile(true)(expr);
		
		ret += '\n?>';

		return ret;
	};

	exports.compile = compileToPhp;
})();
