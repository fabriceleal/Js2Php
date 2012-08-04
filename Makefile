
final=js.js newjs.js

#js.js: js.peg
#	pegjs -e exports.parser js.peg

#newjs.js: newjs.peg
#	pegjs -e exports.parser newjs.peg

anotherjs.js: anotherjs.peg
	pegjs --export-var exports.parser --track-line-and-column --cache anotherjs.peg

