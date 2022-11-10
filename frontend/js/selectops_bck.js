
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
});
            