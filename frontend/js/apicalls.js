//const array_head = [ "CHK","Flag","Check id","check Name","Bussiness Date","Check Run Date","Status","Exceptions","Comment"];
let thead_row = document.createElement("tr");

const dbsearchfacet = async ( facet_term ) =>{
    let bx_majdesc = document.getElementById("BX-MAJDESC");
    let bx_loc = document.getElementById("lk-location");

    let output = document.getElementById("facet1")
    output.innerHTML = "";

    try
    {
        let result = await fetch("http://localhost:3000/fetchfacet?loc="+bx_loc.value+"&BX-MAJDESC="+bx_majdesc.value)
            .then(response => response.json());
        console.log(result);
        //alert(result);
        result.forEach(chat => {
            let messageContainer = document.createElement("a");
            const myArray = chat._id.split("-");
            messageContainer.innerHTML = `${myArray[0]}(${chat.count})` 
            messageContainer.innerHTML += `</br>`
            output.appendChild(messageContainer);
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

const search_simple = async () =>{
    let  field =  document.getElementById("lookup_select").value;
    let qfield = "tags."+field;
    let  fvalue =  document.getElementById("lookup_text").value;

    params  =  "field="+qfield;
    params += "&fvalue="+fvalue;
    //add date only if itis there
    params +=  "&start_date="+document.getElementById("range_start").value;
    params += "&end_date="+document.getElementById("range_end").value;
    params += "&date_path=asat";

    //alert(params);
    display_criteria();

    try
    {
        let result = await fetch("http://localhost:3000/cpd_search?"+params)
            .then(response => response.json());

        //console.log(result);
        render_table(result);
    }catch(e){
        console.error(e);
    }

};

function myFunction(item, index) {
    let th = document.createElement("th");
    th.innerHTML= item;
    thead_row.append(th);
};

const loadtablehead = async ( val ) =>{
    
    try
    {
        let result = await fetch("http://localhost:3000/ui_settings?")
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
    let output = document.getElementById("tbody_rows");
    output.innerHTML = "";
    try
    {
        console.log("Rendering Table for");
        console.log(result);

        result.forEach(chat => {
            let tab_row = document.createElement("tr");
            tab_row.innerHTML += `<td> <input id=${chat['_id']}  type='checkbox' /></td>`
            tab_row.innerHTML += `<td> <img src="icons/red-flag.png" height=25px/></td>`
            tab_row.innerHTML += `<td> ${chat['source_control_id']}</td>`
            tab_row.innerHTML += `<td> ${chat['control_name']}</td>`
            tab_row.innerHTML += `<td> ${chat['asat']}</td>`
            tab_row.innerHTML += `<td> ${chat['timestamp']}</td>`
            tab_row.innerHTML += `<td> ${chat['control_run_status']}</td>`
            tab_row.innerHTML += `<td onclick='pop_doc(\"${chat['_id']}\",\"exceptions\")'> ${chat['number_of_control_exceptions']}</td>`
            tab_row.innerHTML += `<td> comment..123</td>`

            output.appendChild(tab_row);
        });

    }catch(e){
        console.error(e);
    }

};