<?

require_once "JsObject.php";
require_once "JsVariable.php";
require_once "JsFunction.php";

$console = new JsVariable(new JsObject(array(
	"log" => new JsFunction(function (){
		// Get args for function
		$args = func_get_args();

		// Print args. args[0] ==> this
		if(count($args) > 1){
			print $args[1];

			// Try to print the 1st, rigth away
			for($i = 2; $i < count($args); ++$i){
				print " ".$args[$i];
			}
		}
		print "\n";
	}),
	"warn" => new JsFunction(function (){
		print "console.warn\n";
	}),
	"assert" => new JsFunction(function (){
		print "console.assert\n";
	}),
	"err" => new JsFunction(function (){
		print "console.error\n";
	})
)));

?>
