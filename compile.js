#!/usr/bin/node


with(require('./anotherjs.js').parser) {
	require('fs').readFile(process.argv[2], "utf-8", 
			function(err, data){
				if(err) throw err;
				
				var tree = parse(data);

				with(require('./preparse.js')){
					preParse(tree);
				}
				
				with(require('./compiler.js')){
					var res = compile(tree);

					require('fs').writeFile(process.argv[3], res, function(err){ if(err) throw err; });
				}
			});
}
