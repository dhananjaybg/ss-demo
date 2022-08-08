//import ChartsEmbedSDK from '@mongodb-js/charts-embed-dom';

var availableTags = [
        "regulatory",
        "sub_domain",
        "data_source",
        "BCBS",
        "business_process",
        "business_line",
        "domain",
        "region",
        "data_control",
        "all"
      ];
let tags = [];
/*
$(window).load(function(){
    //alert("window load");
    try
    {
        let resultcc = fetch("http://localhost:3000/query_tags")
            .then(response => response.json())
            .then(results => results.map(result => { 
                alert(JSON.stringify(result['keys']));
                tags = result['keys'];
            }));

    }catch(e){
        
        console.error(e);
    }

});
*/

$(document).ready(function () { 

    // facet evertime people hit lookup
    $("#lookup_select").change(function () {
        $("#lookup_text").val('');
        $("#selection_criteria").empty();

    });
    

    $("#lookup_text").autocomplete({
        source: async function(request, response) {
            let field =  document.getElementById("lookup_select").value;
            let qfield = "tags."+field;
            if (qfield == "tags.all"){
                return false;
            }

            console.log("just beforer ....");
            let data = await fetch(`http://localhost:3000/autocomplete?fvalue=${request.term}&field=${qfield}`)
                .then(results => results.json())
                .then(results => results.map(result => { 
                    let ret_val ={"label":"","value":""};
                    ret_val['value'] = result['_id'];
                    return ret_val;
                }));
            //console.log("**** autocomplete console-log-client"+data)
            //alert(JSON.stringify(data));
            response(data);
        },
        minLength: 2
    });

    $( "#lookup_select" ).autocomplete({
        source: async function(request, response) {
            let data = await fetch(`http://localhost:3000/query_tags`)
                .then(results => results.json())
                .then(results => results.map(result => { 
                    //console.log(JSON.stringify(result));
                    return result;
                }));
                response(data);
        },
        minLength: 2
    });
    
    $( "#lookup_select" ).autocomplete({
    source: availableTags
    });
});