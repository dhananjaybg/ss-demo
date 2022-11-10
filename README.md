# ss-demo

This is a basic node js app / demo for Atlas Search.

## setup
- Setup MongoDB database cluster
-  Copy the SRV string from the Atlas Cluster 
-  Setup Atlas Search Indexes 
- Setup NodeJS dev on your laptop 
-  copy the SRV string 


## .ENV file

- ATLAS_SRV="mongodb+srv://user:pass@mongodb_server.mongodb.net/?retryWrites=true&w=majority"
- DB="<<database_name>>"
- COLLECTION="<<collection_name>>"
- RECORD_DISPLAY_COUNT=25

# .config/default.json
- sample UI config files
- NOTE: only change the values for search_fields, table_head,project,facets
- Sample starter file below
  
"ui_settings":{
    "demo_opp": "State Street",
    "search_fields" : ["tags.regulatory","tags.sub_domain","tags.data_source"],
    "table_head" : [ "CHK","Flag","source_control_id","control_name","asat","timestamp","control_run_status","number_of_control_exceptions"],
    "table_head_display" : [ "CHK","Flag","Check id","check Name","Business Date","Check Run Date","Status","Exceptions"],
    "project" : {
        "_id":1,
        "Check id":1,
        "check Name":1,
        "Business Date":1,
        "Check Run Date":1,
        "Status":1,
        "Exceptions":1
    },
    "facets":{
        "inital_year_bucket":{
            "field" :"asat",
            "value" : [ "01 Jan 2020" ,"01 Jan 2021","01 Jan 2022","01 Jan 2023"]
        }
    }
}
