var initiator = 0;

var main_container = {};

function validation(){
    // validate now

    var main_dict = {

    }

    var unit_type       = $("#unit_type").val();
    var qty             = $("#qty").val();
    var internal_area   = $("#internal_area").val();

    // unit type options
    if (unit_type == "" || !(unit_type)) {
        $("#unit_type_error").text("Field is required!");
        return false;
    }else{
        main_dict.unit_type = unit_type;
        $("#unit_type_error").text("");
    }

    // Qty (how manu)
    if (qty == "" || !(qty)) {
        $("#qty_error").text("Field is required!");
        return false;
    }else{
        main_dict.qty = qty;
        $("#qty_error").text("");
    }

    // Internal area
    if (internal_area == "" || !(internal_area)) {
        $("#internal_area_error").text("Field is required!");
        return false;
    }else{
        main_dict.internal_area = internal_area;
        $("#internal_area_error").text("");
    }

    return main_dict;
}


function add_row(){
    // validate entreis
    validate = validation()

    // IF form is OK

    if (validate) {
        // console.log(validate);


        // Add value in list main_container
        main_container[initiator] = validate;


        // add in table with button

        $("#table_body").append(`
        
        
            <tr id="row_${initiator}">
                <td><b>${validate.unit_type}</b></td>
                <td>${validate.qty}</td>
                <td>${validate.internal_area} sqft</td>
                <td>
                    <button type="button" class="btn btn-block btn-outline-danger" onclick="delete_row('${initiator}')">Delete</button>
                </td>

            </tr>
        
        `);

        initiator += 1;

        $("#unit_type").find('option:eq(0)').prop('selected', true);
        $("#qty").val("");
        $("#internal_area").val("");
        $("#main_error").text("");
        // $("#finish_list").find("option:eq(0)").prop("selected", true);

        // console.log(main_container);
        
    }

}


function delete_row(id){
    var asking = confirm("Are you sure to delete this row ?");

    if (asking) {

        // remove from object
        id = parseInt(id);
        // console.log(main_container[id]);
        delete main_container[id];

        // delete from table
        $(`#row_${id}`).remove();
    }
}

function show_results(){
 

    var results = {
        "flat_0": 0,
        "flat_1": 0,
        "flat_2": 0,
        "flat_3": 0,
        "flat_4": 0,
        "terranced_house_2": 0,
        "terranced_house_3": 0,
        "terranced_house_4": 0,
        "terranced_house_5": 0,
        "semi_detached_house_2": 0,
        "semi_detached_house_3": 0,
        "semi_detached_house_4": 0,
        "semi_detached_house_5": 0,
        "detached_house_2": 0,
        "detached_house_3": 0,
        "detached_house_4": 0,
        "detached_house_5": 0,
        "internal_area": 0
    };


    // finish (basic, premium or medium)
    var finish_list     = $("#finish_list").val();
    var postcode        = $("#postcode").val();

    if (finish_list == "" || !(finish_list)) {
        $("#finish_list_error").text("Field is required!");
        return false;
    }else{
        results.finish_quality = finish_list;
        $("#finish_list_error").text("");
    }

    // postcode
    if (postcode == "" || !(postcode)) {
        $("#postcode_error").text("Field is required!");
        return false;
    }else{
        results.postcode = postcode;
        $("#postcode_error").text("");
    }

    var size = Object.size(main_container);
    
    if (size > 0) {
        $("#spin_roll").css("display", "");
        $("#show_text").css("display", "none");

        $("#main_error").text("");
        // console.log(results);
        // console.log();
        // console.log(main_container);

        for(var prop in main_container){
            if (main_container.hasOwnProperty(prop)) {
                // console.log(main_container.key);
                var source_focused = main_container[prop]
                results[source_focused.unit_type] = results[source_focused.unit_type] + parseInt(source_focused.qty);
                results["internal_area"] = results["internal_area"] + parseInt(source_focused.internal_area);
            
            }
        }

        var final_data = JSON.stringify(results);

        $.ajax({
            url: "/get_gdv",
            type: "GET",
            data: `myData=${final_data}`,
            success: function(response){
                $("#spin_roll").css("display", "none");
                $("#show_text").css("display", "");

                console.log(response);
                if (response.status == "success") {
                    $("#sale_estimate").text("£ "+response['result']['sale']['estimate']);
                    $("#sale_margin").text("£ "+response['result']['sale']['margin']);
                    $("#rent_estimate").text("£ "+response['result']['rent']['estimate']);
                    $("#rent_unit").text(response['result']['rent']['unit']);

                    $("#modelId").modal("show");
                }else{
                    alert(response.message);
                }
            }
        })

        console.log(results);
        
    }else{
        $("#main_error").text("Kindly add at least 1 row in above table!");
    }
}


Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};  
