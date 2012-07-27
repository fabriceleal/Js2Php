/*
	Parse the final abstract syntactic tree,
	specially >:( for the php compilation.
	Yeah. Closures need to *know* explicitly about the vars inside.
*/

(function(){

	var recursiveFind = function(tree, tag){
		var ret = [];

		if((tree instanceof Array) || (tree instanceof Object)){
			//console.log('is_array');			
			for(var k in tree){
				ret = ret.concat(recursiveFind(tree[k], tag));
			};			
		}

		if((tree instanceof Object) && (tree.hasOwnProperty('tag')) && (tree.tag === tag)){
			//console.log('is ' + tag);
			ret.push(tree);
		}

		return ret;
	};
	
	var preParse = function(tree){
		recursiveFind(tree, 'function_literal').forEach(function(item){
			// Assume *all* ids not declared inside as captured
			var locals = [ 'this' ], captured = [];

			item.body.value.forEach(function(instruction){
				// 1st look for refs. If they are not declared in locals, push to all_refs
				// TODO Multiple declaration var a = b = c = 1 will break here. FIX the grammar.
				recursiveFind(instruction, 'id').forEach(function(ref){
					if(locals.indexOf(ref.name) === -1 && captured.indexOf(ref.name) === -1){
						captured.push(ref.name);
					}
				});

				if(instruction.tag === "let_collection"){
					recursiveFind(instruction, 'let').forEach(function(decl){
						locals.push(decl.id.name);
					});
				}
			});
			//console.log(locals);
			//console.log(captured);

			// Store in function structure
			item.captured = captured;
		});
	};

	exports.preParse = preParse;

})();
