(function(){

	var auxDispatchToValue = function(is_top_level){
			return function(expr){ 
				return expr.value ? compile(is_top_level)(expr.value) : ''; 
			};
		};
	//--

	var auxJsonStringify = function(is_top_level){
			return function(expr){
				return JSON.stringify(expr.value);
			};
		};
	//--

	var binaryLeftOpRight = function(is_top_level){
			return function(e){
				return compile(false)(e.left) + ' ' + e.op + ' ' + compile(false)(e.right);
			};
		};
	//--

	var binaryLeftConstRight = function(op){
			return function(is_top_level){
				return function(e){ 
					return compile(false)(e.left) + ' ' + op + ' ' + compile(false)(e.right);
				};
			};
		};
	//--

	var compilers = {
		'id' : function(is_top_level){
			// the same as 'ref' and 'decl'
			return function(expr){
				if(is_top_level === true) console.warn('id does not support is_top_level === true');

				return '$' + expr.name;
			};
		},
		'ref' : function(is_top_level){
			return function(expr){
				if(is_top_level === true) console.warn('ref does not support is_top_level === true');

				return '$' + expr.name + '->getValue()';
			};
		},
		'decl' : function(is_top_level){
			// the same as 'id' and 'ref'
			return function(expr){
				if(is_top_level === true) console.warn('decl does not support is_top_level === true');

				return '$' + expr.name;
			};
		},

		'initialiser' : function(is_top_level){
			return function(expr) {
				if(is_top_level === true) console.warn('initializer does not support is_top_level === true');

				// No need to add a '='; check 'varStatement'
				return compile(false)(expr.value);
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
					return compile(false)(d.name) + ' = new JsVariable(' + (d.init ? compile(false)(d.init) : '') + ');\n';
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
				if(expr.operator !== '=') throw new Error('operator ' + expr.operator + ' not supported by assignment!');
				if(expr.left.tag !== 'ref') throw new Error('assignment found a non-ref at the left!');

				// Ugly hack here
				return '$' + expr.left.name + '->setValue(' + compile(false)(expr.right) + ')' + (is_top_level ? ';\n' : '');
			};
		},
		'string_literal': function(is_top_level) {
			return function(expr){
				if(is_top_level === true) console.warn('string_literal does not support is_top_level === true');
				
				return 'new JsString("' + expr.value + '")';
			};
		},
		'number_literal': function(is_top_level) {
			return function(expr){
				if(is_top_level === true) console.warn('number_literal does not support is_top_level === true');
				
				return 'new JsNumber(' + expr.value + ')';
			};
		},
		'call': function(is_top_level){
			return function(expr){
				var a = compile(false)(expr.args);
				if (a)
					a = 'null, ' + a;
				else
					a = 'null';

				// All calls should be proxied through call. This is because $var->getValue()() is invalid syntax!
				return compile(false)(expr.head) + '->call(' + a + ')' + (is_top_level ? ';\n' : ''); 
			}
		},
		'memberExpressionPartDot' : function(is_top_level){
			return function(expr){
				if(expr.value.tag !== 'id') console.err('memberExpressionPartDot does not support values with tag ' + expr.value.tag);

				return '->' + expr.value.name;
			};
		},
		'memberExpressionPartOffset' : function(is_top_level){
			return function(expr){

				return '->get(' + compile(false)(expr.value) + ')';
			};
		},
		'memberExpr': function(is_top_level){
			return function(expr){

				return compile(false)(expr.head) + expr.value.map(compile(false));
			};
		},
		'parenthesis' : function(is_top_level){
			return function(expr){
				return "(" + compile(false)(expr.expression) + ")";
			};
		},
		'and' : binaryLeftOpRight,
		'or'  : binaryLeftOpRight,
		'relational' : binaryLeftOpRight,
		'equality' : binaryLeftOpRight,
		'mult' : binaryLeftConstRight('*'),
		'if' : function(is_top_level){
			return function(expr){
				var ret = 'if(';
				ret += compile(false)(expr.condition);
				ret += ') {\n';
				
				//truebr
				if(expr.truebr) {
					// (expr.truebr.)block.statementList
					ret += compile(true)(expr.truebr.value.value); 
				}

				//falsebr
				if(expr.falsebr) {
					ret += '} else {\n';
					// (expr.falsebr.)block.statementList
					ret += compile(true)(expr.falsebr.value.value);
				}

				ret += '}\n';
				return ret;
			};
		},
		'add' : function(is_top_level){
			return function(expr){				
				if(expr.op === '+'){
					return 'add(' + compile(false)(expr.left) + ', ' + compile(false)(expr.right) + ')';
				}
				
				return compile(false)(expr.left) + ' ' + expr.op + ' ' + compile(false)(expr.right);
			};
		},
		'return' : function(is_top_level) {
			return function(expr){
				if(is_top_level === false) console.warn('return does not support is_top_level === false');
		
				return 'return ' + compile(false)(expr.value) + (is_top_level ? ';\n' : ''); 
			};
		},
		'array_literal' : function(is_top_level) {
			return function(expr){
				if(is_top_level === true) console.warn('array_literal does not support is_top_level === true');
				
				var ret = 'new JsObject(array( ';
				expr.value.forEach(function(e){
					ret += compile(false)(e);
				});
				ret += '))';
				return ret;
			};
		},
		'object': function(is_top_level) {
			return function(expr){
				if(is_top_level === true) console.warn('object does not support is_top_level === true');
				
				var ret = 'new JsObject(array( ';
				ret += expr.value.
						map(function(pair){ 
							var ret = '';
							if(typeof pair.key === 'string') {
								ret = '"' + pair.key + '"';
							}
							else if(pair.key instanceof Number) {
								ret = pair.key;
							}
							else {
								throw new Error('Object with key of type ' + (typeof pair.key) + ' : ' + JSON.stringify(pair.key));
							}

							ret += ' => ' + compile(false)(pair.value); 
							return ret;
						}).
						join(', ');
				//--
				ret += ' ))';

				return ret;
			};
		},
		'functionExpr' : function(is_top_level) {
			return function(expr) {
				if(is_top_level === true) console.warn('functionExpr does not support is_top_level === true');

				// Parameters
				var p = expr.pars.value ? expr.pars.value : [];
				p = p.map(compile(false));
				p.unshift('$self');

				var ret = 'new JsFunction(function(' + p.join(', ') + ')';
				if(expr.captured) {
					ret += ' use (' + expr.captured.map(compile(false)).join(', ') + ') ';
				}
				ret += '{\n ' + compile(true)(expr.body.code) + ' } )';

				return ret;
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
				if(expr.tag)
					console.warn('Compilation does not support: ' + expr.tag);
				else
					console.warn('No tag! ' + JSON.stringify(expr));
				return '';
			}
		}
	};

	var compileToPhp = function(expr){
		var ret = '<?\n';

		// Add headers
		['JsObject.php', 'JsConsole.php', 'JsFunction.php', 'JsAdd.php', 
		'JsVariable.php', 'JsNumber.php', 'JsString.php'].
				forEach(function(item){
					ret += 'require_once "' + item + '";\n';
				});

		ret += '\n';
		
		// Compile code
		ret += compile(true)(expr);
		
		ret += '\n?>';

		return ret;
	};

	exports.compile = compileToPhp;
})();
