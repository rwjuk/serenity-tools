$(document).ready(function(){
	$("#btn-calc-single-postcode").click(function(){
		var p1 = $("#postcode1").val();
		var p2 = $("#postcode2").val();
		if (p1 !== "" && p2 !== "")
		{
			
			jQuery.get( `/api/postcodes/singledistance/${p1}/${p2}`, function( data ) {
				var data_spl = data.split(",");
				var outputBox = $("#output");
				outputBox.val(outputBox.val() + `Distance between ${p1} and ${p2}: ${data_spl[0]} miles, ${data_spl[1]} km\r\n`);
			});
		}
	});
});