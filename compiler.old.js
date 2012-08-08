(function(){

	var compileToString = function(isTopLevel){
		return function(value){
			return value + (isTopLevel ? ';\n' : '');
		};
	};

	var compileLet = function(isTopLevel){
		return function(tree){
			var ret = compile(false)(tree.id) + ' = ' + compile(false)(tree.value);

			if(isTopLevel) ret += ';';

			return ret;
		};
	};

	var compileObjLiteral = function(isTopLevel){
		return function(tree){
			var ret = 'new JsObject(array(' + tree.value.map(compile(false)).join(', ') + '))';

			if(isTopLevel) ret += ';';

			return ret;
		};
	};

	var compileArrayLiteral = function(isTopLevel){
		return function(tree){
			var ret = 'array(' + tree.value.map(compile(false)).join(', ') + ')';

			if(isTopLevel) ret += ';';

			return ret;
		};
	};

	var compileFunction = function(isTopLevel){
		return function(tree){
			var ret = 'new JsFunction(function ( $___this ' ;
			if(tree.args.length > 0){
				ret += ', ';
				ret += tree.args.map(function(e){ return compile(false)(e) + ' = null' }).join(', ');
			}
			ret += ')' 
			if(tree.hasOwnProperty('captured') && tree.captured !== null && tree.captured.length > 0){
				ret += ' use (' + tree.captured.map(function(e){ return '$'+ e; }).join(', ') + ')';
			}
			ret += '{';
			ret += compile(true)(tree.body);
			ret += '})';
			return ret + (isTopLevel?';':'');
		};
	};

	var compileToPhp = function(tree){
		with(require('./preparse.js')){
			preParse(tree);
		}

		var ret = '';
		ret += '<?\n';

		// Necessary includes
		ret += ["JsObject.php", "JsFunction.php"].
				map(function(i){ return 'require_once "' + i + '";\n'}).
				join('');
		//--

		// File's code
		ret += compile(true)(tree);

		ret += '\n?>';

		return ret;
	}; 

	var compile = function(isTopLevel){
		return function(tree){
			switch(tree.tag){
				case "fun_app":
					var ret = compile(false)(tree.fun) + "->call(null";  
					if(tree.args.length > 0){
						ret += ', ' + tree.args.map(compile(false)).join(', ');
					}
					ret += ")" + (isTopLevel?';':'');
					return ret;	
				case "return":
					return "return " + compile(false)(tree.value) + ";";
				case "function_literal":
					return compileFunction(false)(tree);					
				case "parenthesis":
					return "(" + compile(false)(tree.expression) + ")" + (isTopLevel? ';':'');
				case "offsetable_accessor_as_arr":
					return "[" + compile(false)(tree.offset) + "]";
				case "offsetable_accessor_as_obj":
					return "->" + compile(false)(tree.offset);
				case "offsetable":
					return compileToString(isTopLevel)(compile(false)(tree.id) + tree.offset.map(compile(false)).join('') );
				case "object_entry":
					// no toplevel for this one!!!
					return compileToString(false)('"' + tree.key.name + '"') + ' => ' + compile(false)(tree.value);
				case "object_literal":
					return compileObjLiteral(isTopLevel)(tree);
				case "array_literal":
					return compileArrayLiteral(isTopLevel)(tree);
				case "statement_collection":
					// no toplevel for this one!
					return tree.value.map(compile(true)).join('\n');
				case "let_collection":
					// no toplevel for this one!
					return tree.value.map(compileLet(false)).join(',') + ';';
				case "let":
					return compileLet(isTopLevel)(tree); 
				case "id": case "iddeclr": 
					// no toplevel for this one!

					if(tree.name === 'this') tree.name = '___this';

					return "$" + compileToString(false)(tree.name.replace('$', '_'));
				case "property_name":
					// no toplevel for this one!					
					return compileToString(false)(tree.name.replace('$', '_'));
				case "number_literal":
					return compileToString(isTopLevel)(tree.value.toString());
				case "string_literal":
					return compileToString(isTopLevel)('"' + tree.value.toString() + '"');
			}
			console.error(tree.tag);
			throw new Error("Unexpected tag!");
		};
	};

	exports.compile = compileToPhp;
})();