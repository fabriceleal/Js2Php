
final=js.js newjs.js

#js.js: js.peg
#	pegjs -e exports.parser js.peg

newjs.js: newjs.peg
	pegjs -e exports.parser newjs.peg
