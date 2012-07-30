#!/usr/bin/node

with(require('./newjs.js').parser) {

	require('fs').readFile(process.argv[2], "utf-8", function(err, data){
		if(err) throw err;

		console.log(JSON.stringify(parse(data), null, 3));
		
	});

}
