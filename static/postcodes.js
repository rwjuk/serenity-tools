$(document).ready(function(){
	$("#btn-calc-single-postcode").click(function(){
		var p1 = $("#postcode1").val().toUpperCase();
		var p2 = $("#postcode2").val().toUpperCase();
		if (p1 !== "" && p2 !== "")
		{
			jQuery.get( `/api/postcodes/singledistance/${p1}/${p2}`, function( data ) {
				var data_spl = data.split(",");
				var outputBox = $("#output");
				outputBox.val(outputBox.val() + `Distance between ${p1} and ${p2}: ${data_spl[0]} miles, ${data_spl[1]} km\r\n`);
			});
		}
	});
	
	$("#btn-calc-multi-postcode").click(function(){
		var ref = $("#ref_postcode").val().toUpperCase();
		var test_list = $("#postcode2").val().split("\n");
		if (ref !== "" && test_list.length > 0)
		{
			jQuery.post( `/api/postcodes/batchdistance/`, { reference_postcode: ref, test_postcode_list: test_list} , function( data ) {
				/*var data_spl = data.split(",");
				var outputBox = $("#output");
				outputBox.val(outputBox.val() + `Distance between ${p1} and ${p2}: ${data_spl[0]} miles, ${data_spl[1]} km\r\n`);*/
				
				outputBox.val(outputBox.val() + data);
			});
		}
	});
});