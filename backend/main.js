const { MongoClient, ObjectId } = require("mongodb");
const Express = require("express");

const config = require('config');
const env_config = require('dotenv').config();

const Cors = require("cors");
const BodyParser = require("body-parser");
const winston = require('winston');
const morgan = require('morgan');

//const { combine, timestamp, json } = winston.format;
const { combine, timestamp, printf, colorize, align } = winston.format;

const logger = winston.createLogger({
    level: 'info',
    format: combine(
      colorize({ all: true }),
      timestamp({
        format: 'YYYY-MM-DD hh:mm:ss.SSS A',
      }),
      align(),
      printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    transports: [new winston.transports.Console()],
  });

logger.info('Info message');
logger.error('Error message');
logger.warn('Warning message');


const SRV  = process.env.ATLAS_SRV;
const client = new  MongoClient(SRV);

const server = Express();
//server.use(morgan('combined'))
server.use(morgan('tiny'))

server.use(Cors());

var collection;
var loc_collection;

//project stays same because of table
const options = {}; 
const project = {};

function build_project_stage(){
    project['_id']= 1,
    project['source_control_id']= 1,
    project['control_name']= 1,
    project['asat']= 1,
    project['timestamp']= 1,
    project['control_run_status']= 1,
    project['number_of_control_exceptions']= 1

    options['projection'] = project;
};



server.get("/getdoc", async (request, response) => {
  const doc_id = `${request.query.docid}`;
  console.log(doc_id);
  try {
      let query = {}
      query['_id'] = new ObjectId(doc_id);
      let result = await collection.findOne(query,{});
      response.send(result);
  } catch (e) {
    logger.warn(e.message);
    response.status(500).send({ message: e.message });
  }
});

server.get("/autocomplete", async (request, response) =>{
  console.log("autocomplete");
  let path  = `${request.query['field']}`; 
  let value  = `${request.query['fvalue']}`;  
  console.log("path : "+path);
  console.log("value : "+ value);
  
  const aggpipe = [];
  const search_stage =
    {
      '$search': {
        'autocomplete': {
          'query': "Rexxxx", 
          'path': "tags.regulatory", 
          'fuzzy': {
            'maxEdits': 2, 
            'prefixLength': 2, 
            'maxExpansions': 256
          }
        }
      }
    };

  search_stage['$search']['autocomplete']['query'] = value;
  search_stage['$search']['autocomplete']['path'] = path;
  //console.log(JSON.stringify(search_stage));

  const limit_stage = {"$limit":25};
  const project_stage = {}
  
  //build project stage
  let tmp = "{\"_id\":0,\""+ path +"\":1}";
  project_stage['$project'] = JSON.parse(tmp);
  //console.log(JSON.stringify(project_stage));

  const group_stage = {};
  let grp_tmp = "{\"_id\":\"$"+ path +"\"}";
  group_stage['$group'] = JSON.parse(grp_tmp);
  //console.log(JSON.stringify(group_stage));

  aggpipe.push(search_stage);
  aggpipe.push(limit_stage);
  aggpipe.push(project_stage);
  aggpipe.push(group_stage);
  //console.log("Aggpipe ==> " + JSON.stringify(aggpipe));

  try {
    let results_gen = await collection.aggregate(aggpipe).toArray();
    //console.log(results_gen)
    response.send(results_gen);

  }catch(e){
    logger.warn(e.message);
    console.error(e);
  }

});

server.get("/cpd_search", async (request, response) =>{


  
  console.log("compound_search");
  let path  = `${request.query['field']}`; 
  let value  = `${request.query['fvalue']}`;  
  console.log(path);
  console.log(value);

  if ( path == "tags.all"){
    path = tags_path;
  }
 
  const start_date  = `${request.query['start_date']}`; 
  const end_date  = `${request.query['end_date']}`;  
  const date_path  = `${request.query['date_path']}`;  
  console.log(start_date);
  console.log(end_date);
  console.log(date_path);


  const aggpipe = [];
  const search_cpd_stage = {}
  
  const must_arr = [];
  const must_range = {}
  const must_text = {}

  
  must_text['text'] = {};
  must_text['text']['query'] = value;
  must_text['text']['path'] = path;
  must_arr.push(must_text);
  
  if(start_date && end_date){
    must_range['range']={};
    must_range['range']['path'] = date_path;
    must_range['range']['gt'] = new Date( start_date);
    must_range['range']['lt'] = new Date ( end_date );
    must_arr.push(must_range);

  }

  search_cpd_stage['$search'] = {};
  search_cpd_stage['$search']['compound']= {};
  search_cpd_stage['$search']['compound']['must']= must_arr;

  const limit_stage = {$limit:25}
  const project_stage = {}
  project_stage['$project']= project;
  

  aggpipe.push(search_cpd_stage);
  aggpipe.push(limit_stage);
  aggpipe.push(project_stage);

  console.log("Aggpipe ==> " + JSON.stringify(aggpipe));

  try {
    let results_gen = await collection.aggregate(aggpipe).toArray();
    //console.log(results_gen)
    response.send(results_gen);

  }catch(e){
    console.error(e);
  }

});
server.get("/simple_search", async (request, response) =>{
  console.log("simple_search");
  const path  = `${request.query['field']}`; 
  const value  = `${request.query['fvalue']}`;  
  console.log(path);
  console.log(value);
 
  const aggpipe = [];

  const search_stage =
    {
      '$search': {
        'text': {
          'query': "Rexxxx", 
          'path': "tags.regulatory"
        }
      }
    };
    
  search_stage['$search']['text']['query'] = value
  search_stage['$search']['text']['path'] = path

  

  const limit_stage = {$limit:25}
  const project_stage = {}
  project_stage['$project']= project;

  aggpipe.push(search_stage);
  aggpipe.push(limit_stage);
  aggpipe.push(project_stage);

  console.log("Aggpipe ==> " + JSON.stringify(aggpipe));

  try {
    let results_gen = await collection.aggregate(aggpipe).toArray();
    //console.log(results_gen)
    response.send(results_gen);

  }catch(e){
    console.error(e);
  }

});


server.get("/fetch_tags_agg_trigger", async (request, response) =>{
  console.log("fetch_tags");
  
  let aggpipe = [
    {
      '$project': {
        'keyValue': {
          '$objectToArray': '$tags'
        }
      }
    }, {
      '$unwind': '$keyValue'
    }, {
      '$group': {
        '_id': null, 
        'keys': {
          '$addToSet': '$keyValue.k'
        }
      }
    }
  ];


  try {
    let results_gen = await collection.aggregate(aggpipe).toArray();
    console.log(results_gen)
    let results = results_gen[0].keys;
    response.send(results);

  }catch(e){
    console.error(e);
  }

});


server.get("/query_tags", async (request, response) =>{
  console.log("fetch_tags");
  const query = {_id:1};
  const options = {};
  //,{_id:0,'keys':1}

  try {
    let results_gen = await tags_collection.find(query,options).toArray();
    console.log(results_gen)
    let results = results_gen[0].keys;
    response.send(results_gen);

  }catch(e){
    console.error(e);
  }

});

server.get("/loadtable", async (request, response) =>{
    
    const query = {}; 
    console.log("query ==> " + query);
    console.log("options ==> " + options);

    try {
      
      let results_gen = await collection.find(query,options).limit(100).toArray();
      response.send(results_gen);
    }catch(e){
      console.error(e);
    }

});

server.get("/ui_settings", async (request, response) =>{

  try {
    const table_head  = config.get('ui_settings.table_head');
    console.log(table_head);
    response.send(table_head);
  } catch(e){
    console.error(e);
  }

});


server.listen("3000", async () =>{
    try {
        const DB  = process.env.DB;//config.get('atlas.database');
        const COLL  =  process.env.COLLECTION ;//config.get('atlas.collection');
        const TAGS_COLL  =  process.env.TAGS_COLLECTION ;

        console.log(DB);
        console.log(COLL);
        await client.connect();
        collection = client.db(DB).collection(COLL);

        tags_collection = client.db(DB).collection(TAGS_COLL);
        //console.log(collection);
        //get your 1 time setup 
        build_project_stage();

        let var_var = process.env.ATLAS_SRV;
        
        
    } catch (e){
        console.error(e);
    }
});
