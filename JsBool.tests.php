<?
require_once "JsBool.php";

$t = new JsBool(true);
$f = new JsBool(false);

if($t->IsTrue()){
	print "t is true!\n";
}else{
	print "t is false!\n";
}

if($f->IsTrue()){
	print "f is true!\n";
}else{
	print "f is false!\n";
}

?>
