<?

require_once "JsObjectBase.php";

// TESTS:
$a = new JsObjectBase();
$a->id = 123;
$a->barf = function(){
	print "houf!\n";
};

$b = JsObjectBase::CreateWithProto($a);

$test_a = function() use ($a){
	print("a.Id ".($a->id)."\n");
	print("a.barf()\n");
	$a->barf();
};

$test_b = function() use ($b){
	print("b.Id ".($b->id)."\n");
	print("b.barf()\n");
	$b->barf();
};

print "Should be the same!\n";

$test_a();
$test_b();

$b->id = 321;
$b->barf = function(){
	print "bbbb...houf!\n";
};

print "Ids and barf should be different!\n";

$test_a();
$test_b();


?>
