
final=js.js

js.js: js.peg
	pegjs -e exports.parser js.peg

