
grammarjs.js: grammarjs.peg
	pegjs --export-var exports.parser --track-line-and-column --cache grammarjs.peg

