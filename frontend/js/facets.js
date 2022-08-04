
const dbsearchfacet = async ( facet_field, search_term ) =>{
    let bx_majdesc = document.getElementById("BX-MAJDESC");
    let bx_loc = document.getElementById("lk-location");

    let output = document.getElementById("facet1")
    output.innerHTML = "";

    try
    {
        let result = await fetch("http://localhost:3000/fetchfacetcontrol?facet_field="+facet_field+"&search_term"+search_term)
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
