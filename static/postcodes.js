$(document).ready(function(){
	$("#btn-calc-single-postcode").click(function(){
		var p1 = $("#postcode1").val().toUpperCase();
		var p2 = $("#postcode2").val().toUpperCase();
        var format = "readable";
        var units = "km";
		if (p1 !== "" && p2 !== "")
		{
			jQuery.get( `/api/postcodes/singledistance/${p1}/${p2}`, function( data ) {
				var data_spl = data.split(",");
                var value;
                if (units === "km"){
                    value = data_spl[1];
                } else if (units === "miles") {
                    value = data_spl[0];
                }
				var outputBox = $("#output");
                if (format === "readable"){
                    outputBox.val(outputBox.val() + `Distance between ${p1} and ${p2}: ${value} ${units}\r\n`);
                } else {
                    outputBox.val(outputBox.val() + `${value}\r\n`);
                }
			});
		}
	});
	
	$("#btn-calc-multi-postcode").click(function(){
		var ref = $("#ref_postcode").val().toUpperCase();
		var test_list = $("#postcode-list").val().split("\n");
        var format = "readable";
        var units = "km";
		if (ref !== "" && test_list.length > 0)
		{
			jQuery.ajax({
				type: 'POST',
				url: '/api/postcodes/batchdistance',
				data: JSON.stringify({ reference_postcode: ref, test_postcode_list: test_list }),
				contentType: "application/json",
				dataType: 'json'
			}).done(function(data){
                var outputBox = $("#output");
                var output = "";
                for(var key in data){
                    if (obj.hasOwnProperty(key)){
                        var value=obj[key];
                        if (format === "readable"){
                            output += `${key}: ${value[units]} ${units}\r\n`;
                        } else {
                            output += `${key}, ${value[units]}\r\n`;
                        }
                    }
                }
				outputBox.val(outputBox.val() + output);
			});
		}
	});
});