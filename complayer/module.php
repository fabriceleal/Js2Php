<?
	// "private-globals". Will this work???
	/*static $module;
	static $require;
	static $exports;*/

	$module = (object) array();
	$require = $module->require = function($mod_name, $__){
		static cache = (object) array();

		// TODO Put this in another file! :(
		// TODO Cache results

		$contents = file_get_contents( $mod_name );

		return eval( $contents );
	};
	$module->id = " This is id module 1 ";
	$module->filename = " This is filename module 1 ";
	$module->loaded = false;
	$module->parent = null;
	$module->children = null;
	$module->export = $exports = (object) array();
	$module->resolve = null;

	// vars declared without scope should be global
	print $module->id; print "\n";	
	print $module->filename; print "\n";

	$t = $require("module2.php", "...");

	print $module->id; print "\n";	
	print $module->filename; print "\n";

	$exports->a = $t->field;
	$exports->b = $t->field2;
	$exports->c = $t->field3;

	/*function(){
		
	};*/

	// module should return it's export object
	print $exports->a; print "\n";
	print $exports->b; print "\n";
	print $exports->c; print "\n";
	//print $exports->field;

	return $exports;
?>
