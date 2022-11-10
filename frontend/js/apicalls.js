//const array_head = [ "CHK","Flag","Check id","check Name","Bussiness Date","Check Run Date","Status","Exceptions","Comment"];
let thead_row = document.createElement("tr");
const table_field_array = [];


const apply_facet = async ( facet_term ) =>{
    alert(facet_term);
    //search_desc(facet_term);
};


const dbsearchfacet = async ( facet_term ) =>{
    let lookup_select = document.getElementById("lookup_select");
    let lookup_text = document.getElementById("lookup_text");
    let range_start = document.getElementById("range_start");
    let range_end = document.getElementById("range_end");

    let params = "lookup_select="+lookup_select.value;
    params +="&lookup_text="+lookup_text.value;
    params +="&range_start="+range_start.value;
    params +="&range_end="+range_end.value;


    let output = document.getElementById("facet1")
    output.innerHTML = "";
    try
    {
        let result = await fetch("http://localhost:3000/fetchfacet?"+params)
            .then(response => response.json());
        console.log(result);
        //alert(result);
        result.forEach(chat => {
            let facetlink = document.createElement("dl");
            const myArray = chat._id.split("-");
            //messageContainer.innerHTML = `${myArray[0]}(${chat.count})` 
            //messageContainer.innerHTML += `</br>`
            facetlink.innerHTML = `<dt onclick="apply_facet(${myArray[0]})">${myArray[0]}(${chat.count})</dt>` 
            output.appendChild(facetlink);
        });
    }catch(e){
        console.error(e);
    }

};

const display_criteria = async () =>{
    let v1 = document.createElement("span")
    v1.innerHTML = field.value;
    let v2 = document.createElement("span")
    v2.innerHTML = fvalue.value;
    let c  = document.getElementById("selection_criteria");
    c.innerHTML = "";
    c.appendChild(v1);
    c.appendChild(v2);
};

const search_simple = async ( f_start, f_end) =>{
    let  field =  document.getElementById("lookup_select").value;
    let qfield = "tags."+field;
    let  fvalue =  document.getElementById("lookup_text").value;

    params  =  "field="+qfield;
    params += "&fvalue="+fvalue;
    //add date only if itis there
    params +=  "&start_date="+document.getElementById("range_start").value;
    params += "&end_date="+document.getElementById("range_end").value;
    params += "&date_path=asat";
    if (f_start && f_end){
        params += "&f_start="+f_start;
        params += "&f_end="+f_end;
    }else{
        //use these as 
        f_start = document.getElementById("range_start").value;
        f_end = document.getElementById("range_end").value;
    }
    


    //alert(params);
    //display_criteria();

    try
    {
        let result = await fetch("http://localhost:3000/cpd_search?"+params)
            .then(response => response.json());

        //console.log(result);
        render_table(result);
    }catch(e){
        console.error(e);
    }

    //now cal the facets engine
    dbsearchfacet();
};

function myFunction(item, index) {
    let th = document.createElement("th");
    //alert(item);
    table_field_array.push(item);
    th.innerHTML= item;
    thead_row.append(th);
};
const THEAD3 = [];
const loadtablehead = async ( val ) =>{
    //val = "table_head";
    try
    {
        let result = await fetch("http://localhost:3000/ui_settings?ui-comp="+val)
            .then(response => response.json());
            let thead = document.createElement("thead");
            //array_head.forEach(myFunction);
            result.forEach(myFunction);
            thead.append(thead_row);
            document.getElementById("table_out").append(thead);
    }catch(e){
        console.error(e);
    }

    
};

const loadtable = async ( val ) =>{
    try
    {
        let result = await fetch("http://localhost:3000/loadtable?")
            .then(response => response.json());
        console.log(result);
        render_table(result);
     
    }catch(e){
        console.error(e);
    }

};

const render_table = async ( result ) =>{
    //alert(JSON.stringify(THEAD));

    let output = document.getElementById("tbody_rows");
    output.innerHTML = "";
    try
    {
        console.log("Rendering Table for");
        console.log(result);
        //alert(JSON.stringify(result));
        result.forEach(chat => {
            let tab_row = document.createElement("tr");
            tab_row.innerHTML += `<td> <input id=${chat['_id']}  type='checkbox' /></td>`
            tab_row.innerHTML += `<td> <img src="icons/red-flag.png" height=25px/></td>`
            /*
            tab_row.innerHTML += `<td> ${chat['source_control_id']}</td>`
            tab_row.innerHTML += `<td> ${chat['control_name']}</td>`
            tab_row.innerHTML += `<td> ${chat['asat']}</td>`
            tab_row.innerHTML += `<td> ${chat['timestamp']}</td>`
            tab_row.innerHTML += `<td> ${chat['control_run_status']}</td>`
            tab_row.innerHTML += `<td onclick='pop_doc(\"${chat['_id']}\",\"exceptions\")'> ${chat['number_of_control_exceptions']}</td>`
            */
            //tab_row.innerHTML += `<td> comment..123</td>`
            table_field_array.forEach( elem =>{
                let tab_row_field = document.createElement("td");
                let valx = chat[elem];
                if (valx){
                    tab_row_field.innerHTML = valx ;
                    tab_row.appendChild(tab_row_field);
                }else{

                }
                
                
            }
            )

            output.appendChild(tab_row);
        });

    }catch(e){
        console.error(e);
    }

};




//$('#lk-location').on('ready', function (event) {
    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
    
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
    
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };
    
    $( document ).ready(function() {
        //fecth table_head data from server
        loadtablehead("table_head");
        //run Database Search and Facet 1st time
        loadtable();
        //alert("loading table complete");
        
    });

    $(window).on("load", function() {
        //this event is fired after document ready
        //alert("Widow load fires after loading table!!");
        //$('#table_out').DataTable();
    });

                