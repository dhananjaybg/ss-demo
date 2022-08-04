const opendoc = async () =>{
    
    let bx_majdesc = document.getElementById("BX-MAJDESC");
    let output = document.getElementById("doc_text")
    output.innerHTML = "";

    try
    {
        let result = await fetch("http://localhost:3000/get?doc_id=628d2f04238357006cb2334a")
            .then(response => response.json());
        console.log(result);
        result.forEach(chat => {
            let messageContainer = document.createElement("p");
            messageContainer.innerHTML = `${chat.value}`
            output.appendChild(messageContainer);
        });
    }catch(e){
        console.error(e);
    }

};

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

const search_desc_XXX = async ( valx ) =>{
    //alert("search_desc");
    let loc_term = document.getElementById("lk-location");
    let cs_term = document.getElementById("lk-customer");
    let bx_plusid = document.getElementById("BX-PLUSID");
    let bx_majdesc = document.getElementById("BX-MAJDESC");
    let rn_reccode = document.getElementById("RN-RECCODE");
    let barcode = document.getElementById("barcode");
    //buildstring
    params  =  "location="+loc_term.value;
    params += "&CS-ID="+cs_term.value;
    params += "&bx_plusid="+bx_plusid.value;
    params += "&bx_majdesc="+bx_majdesc.value;
    params += "&rn_reccode="+rn_reccode.value;
    params += "&barcode="+barcode.value;
    console.log(params);

    let cust_id = document.getElementById("lk-customer");
    let desc_term = document.getElementById("BX-MAJDESC");
    let path_var = "BX-MAJDESC";

    let output = document.getElementById("tbody_rows");
    output.innerHTML = "";

    try{
        dbsearchfacet(desc_term.value);
    }catch(e){
        console.error(e);
    }


    try
    {
        //let result = await fetch("http://localhost:3000/search_cpd?cust_id="+cust_id.value+"&desc_term="+desc_term.value+"&path_var="+path_var)
        let result = await fetch("http://localhost:3000/search_cpd?"+params)
            .then(response => response.json());
        
        
        result.forEach(chat => {
            
            
            chat.highlights.forEach(highlights =>{
                let texts = highlights.texts;

                let replacements = texts.map(text =>{
                    if (text.type == "hit"){
                        return `<mark>${text.value}</mark>`
                    } else {
                        return text.value;
                    }
                }).join("");
                    
                let originals = texts.map(text =>{
                    return text.value;
                }).join("");

                console.log(chat)
                console.log("=====>"+originals);
                console.log("=====>"+replacements);  
                
                chat['BX-MAJDESC'] = chat['BX-MAJDESC'].replace(originals, replacements);

                let tab_row = document.createElement("tr");
                tab_row.innerHTML += `<td id='${chat._id}' onclick=pop_doc('${chat._id}')><a>${chat['CS-ID']}</a></td>`
                tab_row.innerHTML += `<td> ${chat['LC-ID']}</td>`
                tab_row.innerHTML += `<td> ${chat['BX-PLUSID']}</td>`
                tab_row.innerHTML += `<td> ${chat['RN-RECCODE']}</td>`
                tab_row.innerHTML += `<td> ${chat['BX-MAJDESC']}</td>`
                tab_row.innerHTML += `<td> ${chat['BX-MINDESC']}</td>`
                tab_row.innerHTML += `<td> ${chat['BX-DESTDATE']}</td>`
                tab_row.innerHTML += `<td><button type="button" onclick="fetch_loc('${chat['LC-ID']}')" id="myBtn">Get Location</button></td>`
                
                output.appendChild(tab_row);
            });
            
            
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