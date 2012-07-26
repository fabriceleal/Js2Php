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

	var compileToPhp = function(tree){
		var ret = '';
		ret += '<?\n';

		ret += 'require_once "JsObject.php"; \n';
		ret += compile(true)(tree);

		ret += '\n?>';

		return ret;
	}; 

	var compile = function(isTopLevel){
		return function(tree){
			switch(tree.tag){
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
				case "id":
					// no toplevel for this one!
					return "$" + compileToString(false)(tree.name.replace('$', '_'));
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
