<?

?>
This is a module. How do u think u are?
<?
/*
	ATTENTION: This is not a valid php file! Block execution of this file!
*/
/*
	Beginning of module2
*/

// "private-globals". Will this work???
/*static $module;
static $require;
static $exports;*/

$module = (object) array();
$require = $module->require = function($mod_name, $__){
	// TODO Put this in another file! :(
	// TODO Cache results
	return eval(file_get_contents( $mod_name ));
};
$module->id = "this is module 2";
$module->filename = " this is module 2, filename";
$module->loaded = false;
$module->parent = null;
$module->children = null;
$module->export = $exports = (object) array();
$module->resolve = null;

// vars declared without scope should be global

//function(){
	$exports->field = "asd";
	$exports->field2 = $module->id;
	$exports->field3 = $module->filename;
//};

// module should return it's export object
return $exports;

/*
	End of module2
*/

?>
