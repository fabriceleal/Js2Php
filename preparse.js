/*
	Parse the final abstract syntactic tree,
	specially >:( for the php compilation.
	Yeah. Closures need to *know* explicitly about the vars inside.

	TODO Enforce:
			* do not use undeclared vars
			* do not redeclare vars with the same name as already captured vars
			* do not allow redeclare vars
*/

(function(){
	// Start of module

	var ConsoleClass = function(c, logLevel){
		var levels = ['l', 'w'];

		this.__levels = levels.slice(levels.indexOf(logLevel));
		this.__loggingLevel = logLevel;
		this.__console = c;

		// This will shadow the prototype
		if(this.__levels.indexOf('l') === -1) {
			this.log = function(){ };
		}
		if(this.__levels.indexOf('w') === -1) {
			this.warn = function(){ };
		}
	};
	ConsoleClass.prototype.log = function(){
		this.__console.log.apply(this.__console,  ['PREPARSE l: '].concat(Array.prototype.slice.call(arguments, 0)));
	};
	ConsoleClass.prototype.warn = function(){
		this.__console.warn.apply(this.__console, ['PREPARSE w: '].concat(Array.prototype.slice.call(arguments, 0)) );
	}

	var __console = new ConsoleClass(console, 'w');

	(function(){
		var console = __console;

		// Start of scope with new console

		var initEnv = {
			locals: {
				// Put here node.js globals
				'console' : true 
			}, 
			inner: undefined 
		};

		// Generic heavy-weight parser
		var walk = function(tree, env, captured) {
			for(var k in tree) {
				if(tree[k] instanceof Object && tree[k].hasOwnProperty('tag')) {
					parser(tree[k], env, captured);
				}
				if(tree[k] instanceof Array) {
					tree[k].forEach(function(i){
						parser(i, env, captured);
					});
				}
			}

		};

		// Used to clean the captured vars struct
		var nestyness = -1;

		// The instruction's parsers
		var inst_parser = {
			'decl': function(){
				throw new Error('declared vars should be better handled!');
			},
			'ref' : function(tree, env, captured) {
				console.log('Reference to var ' + tree.name + ', env: ' + JSON.stringify(env, null, 3));

				// If var is not present in local scope, assume its captured
				if(! env.locals.hasOwnProperty(tree.name)) {
					console.log('Captured: ' + tree.name);
				
					captured.a[captured.a.length - 1][tree.name] = true;
				}
			},
			'add;expression;return;assignment;call;arguments;memberExpr;memberExpressionPartOffset;memberExpressionPartDot;parenthesis;object;array_literal' : walk,
			'objectSlot' : function(tree, env, captured) { parser(tree.value, env, captured); },
			'functionDecl;functionExpr' : function(tree, env, captured) {  
				++nestyness;

				// Create a new env, which will contain the function's vars
				var newEnv = { locals:{ }, inner:env };

				// If the function has a name, put it in the current env
				if(tree.name) {
					if(tree.tag === 'functionExpr') {
						if(typeof tree.name.name !== 'string')
							throw new Error('Expression function name is not a string!' + JSON.stringify(tree.name.name))

						// If this is a functionExpr, the name of the function 
						// will be visible only in its own scope
						newEnv.locals[tree.name.name] = true;
					} else if(tree.tag === 'functionDecl') {
						if(typeof tree.name.name !== "string")
							throw new Error('Declared function name is not a string!' + JSON.stringify(tree.name.name))

						// Functions declared with a name are visible in the global scope
						env.locals[tree.name.name] = true;
					}
				}
			
				if(tree.pars) {
					tree.pars.value.forEach(function(v) {
						if(typeof v.name !== "string")
							throw new Error('Parameter name is not a string!' + JSON.stringify(v.name))

						newEnv.locals[v.name] = true;
					});
				}
			
				// New captured context (...)
				captured.a.push({ });

				// Parse functions body
				tree.body.code.forEach(function(i) { 
					parser(i, newEnv, captured); 
				});
				console.log('Old captured: ' + JSON.stringify(captured.a));
				var tmp = captured.a.
						slice(nestyness).
						map(function(i){ var r = []; for(var k in i){ r.push(k); } return r; }).
						reduce(function(t, i){ return t.concat(i) }, []).
						reduce(function(t, i){ if(t.indexOf(i) === -1) t.push(i); return t;}, []).
						map(function(i){ return { tag:'decl', name:i}; });


				if(tmp && tmp.length > 0) {
					tree.captured = tmp;
				}
				//captured.locals = newCaptured;
				--nestyness;
				if(nestyness === -1) {
					toplevel = true;
					captured.a = [];
				}
			
			},
			'varStatement' : function(tree, env, captured) {
				var newVars = [];

				//console.log(JSON.stringify(tree));
			
				tree.value.forEach(function(decl) {
					// Search for references in the init expressions
					if(decl.init) {
						parser(decl.init.value, env, captured);
					}
				
					newVars.push(decl.name.name);
				});
			
				// Now update the current env with the declared vars
				newVars.forEach(function(v) { 
					if(typeof v !== "string")
						throw new Error('Parameter name is not a string!' + JSON.stringify(v))

					console.log('Declared: ' + v);
					env.locals[v] = true; 
				});			
			}
		};

		// To avoid code replication, I used a special notation in the obj's keys,
		// that is unfolded here. No real processing here.
		for(var k in inst_parser) {
			(function(){
				var agg = k;
				var splitted = agg.split(";");

				if(splitted.length > 1) {
					var obj = inst_parser[agg];

					splitted.forEach(function(key){
						//console.log('Defining the getter of "' + key + '" as the same of "' + agg + '"');
						inst_parser.__defineGetter__(key, function(){ return obj; });
					});

					// Now this is garbage ...
					inst_parser[agg] = undefined;
				}
			})();		
		}

		// The AST parser. Looking for captured vars...
		var parser = function(tree, env, captured){
			if(! tree)
			{
				console.warn('will skip null elem...'); return;
			}

			if(tree instanceof Array)
			{
				tree.forEach(function(elem) { return parser(elem, env, captured); }); return;
			}

			if(! tree.tag)
			{
				console.warn('will skip elem without tag... ' + JSON.stringify(tree.tag)); return;
			}

			var f = inst_parser[tree.tag];
			if(! f) {
				console.warn('will skip elem ("' + tree.tag + '") without callback...'); return;
			}

			f(tree, env, captured);
		};
	
		// The AST parser used by the world
		exports.preParse = (function(){ return function(tree){ 
			parser(tree, initEnv, { a:[] });
		}})();

		// End of scope with new console
	})();

	// End of module
})();
