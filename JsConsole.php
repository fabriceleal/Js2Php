<?

require_once "JsObject.php";

$console = new JsObject(array(
	"log" => function (){
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
	},
	"warn" => function (){
		print "console.warn\n";
	},
	"assert" => function (){
		print "console.assert\n";
	},
	"err" => function (){
		print "console.error\n";
	}
));

?>
