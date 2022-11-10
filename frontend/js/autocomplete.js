//import ChartsEmbedSDK from '@mongodb-js/charts-embed-dom';
//notused 

let tags = [];

const PARENT_FIELD = "";

$(window).load(function(){
});

$(document).ready(function () { 

    // facet evertime people hit lookup
    $("#lookup_select").change(function () {
        $("#lookup_text").val('');
        $("#selection_criteria").empty();

    });
    
    $("#lookup_text").autocomplete({
        source: async function(request, response) {
            let field =  document.getElementById("lookup_select").value;
            let qfield = PARENT_FIELD + field;
            if (qfield == PARENT_FIELD + "all"){
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
            console.log("**** autocomplete console-log-client"+data)
            //alert(JSON.stringify(data));
            response(data);
        },
        minLength: 2
    });

    $( "#lookup_select" ).autocomplete({
        source: async function(request, response) {
            let data = await fetch(`http://localhost:3000/ui_settings?ui-comp=search_fields`)
                .then(results => results.json())
                .then(results => results.map(result => { 
                    console.log("#lookup_select ==> "+ JSON.stringify(result));
                    return result;
                }));
                response(data);
        },
        minLength: 2
    });
    
    //$( "#lookup_select" ).autocomplete({
    //    source: availableTags
    //});
});