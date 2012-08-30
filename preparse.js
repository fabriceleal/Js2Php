/*
	Parse the final abstract syntactic tree,
	specially >:( for the php compilation.
	Yeah. Closures need to *know* explicitly about the vars inside.
*/

(function(){

	var recursiveFind = function(tree, tag, scopeAware){
		var ret = [];
		var matchTag;
		if(tag instanceof Array){
			matchTag = function(toMatch){ return tag.indexOf(toMatch) > -1; };
		} else {
			matchTag = function(toMatch){ return tag === toMatch; };
		}

		if(scopeAware === undefined) scopeAware = false;

		if((tree instanceof Array) || (tree instanceof Object)){
			//console.log('is_array');			
			for(var k in tree){

				if(scopeAware && tree[k].tag === 'function_literal')
					continue;

				ret = ret.concat(recursiveFind(tree[k], tag));
			};			
		}

		if((tree instanceof Object) && (tree.hasOwnProperty('tag')) && matchTag(tree.tag)){
			ret.push(tree);
		}

		return ret;
	};
	
	var preParse = function(tree){
		recursiveFind(tree, ['functionDecl', 'functionExpr']).forEach(function(item){

			// Assume *all* ids not declared inside as captured
			var locals = [ 'this' ], captured = [];

			// Add current function's parameters to locals
			item.pars.value.forEach(function(par){
				locals.push(par.name);
			});

			console.log('* pars = ' + JSON.stringify(locals));


			// Parse each function instruction
			item.body.code.forEach(function(instruction){
				console.log('** instr: ' + JSON.stringify(instruction));

/*
				// 1st look for refs. If they are not declared in locals, push to all_refs
				// TODO Multiple declaration var a = b = c = 1 will break here. FIX the grammar.
				// FIXME function(a){ return function(b){ return a + b}} breaks here.

				recursiveFind(instruction, 'id', true).forEach(function(ref){
					if(locals.indexOf(ref.name) === -1 && captured.indexOf(ref.name) === -1){
						captured.push(ref.name);
					}

				});

				if(instruction.tag === "let_collection"){

					recursiveFind(instruction, 'let').forEach(function(decl){
						locals.push(decl.id.name);
					});

				}
*/

			});
			//console.log(locals);
			//console.log(captured);

			// Store in function structure
			item.captured = captured;			
			/**/
		});
	};

	exports.preParse = preParse;

})();
