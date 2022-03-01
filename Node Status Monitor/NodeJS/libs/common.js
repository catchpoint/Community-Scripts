// dependent packages and libray required
import fs, { write } from 'fs';
import config from '../config/config.js';
import log from '../utils/logger.js';
import constant from '../utils/application_constants.js';
import { get_catchpoint_token,fetch_catchpoint_node_deatils } from '../libs/api.js';


// Catchpoint Credentials
const client_key = config.client_key;
const client_secret = config.client_secret;

// Look up for node fields
var lookUp_fields = config.lookUp_fields;

// Output files and location
const raw_file_current_session = constant.raw_files_path.current_session;
const raw_file_previous_session = constant.raw_files_path.previous_session;
const output_folder_path = constant.output_folder_path;
const raw_data_folder_path = constant.raw_data_folder_path;
const default_lookup_fields = constant.default_lookup_fields;


// function to read old Node Details from file for comparing with latest Node Details.
function read_previous_session_node_data() {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(`${output_folder_path}/${raw_data_folder_path}/${raw_file_current_session}`)) {
            log.info(" Reading old Node Details ")
            fs.readFile(`${output_folder_path}/${raw_data_folder_path}/${raw_file_current_session}`, 'utf8', function readFileCallback(err, data) {
                if (err) {
                    reject(err);
                } else {
                    if (data) {
                        let previous_session_node_data = JSON.parse(data);
                        resolve(previous_session_node_data)
                    } else {
                        resolve(data)
                    }
                }
            });
        } else {
            resolve()
        }
    });
}

// function to compare Node Details based on their status
function compare_node_data(old_data, new_data, lookup_field = 'status.name') {
    log.info(" Comparing Node Details ")
    var lookup_field_key= lookup_field.split('.'); //lookup_field_key
    
    var changed_nodes = new_data.filter(new_node => {
        return old_data.some(old_node => {
            if (old_node.id == new_node.id) {   
                const new_node_compare_value = lookup_field_key.reduce((a, key) => a[key], new_node);
                const old_node_compare_value = lookup_field_key.reduce((a, key) => a[key], old_node);
                return old_node_compare_value!= new_node_compare_value
            };
        });
    });
    return changed_nodes;
}

// function to write raw node data/ result data to its file 
function write_raw_and_result_node_details(write_type,file_name,node_details){
    log.info(` Writing Node Details to ${file_name} `)
     if(!output_folder_path || !raw_data_folder_path){
         throw "Add vaild folder name for output_folder_path and raw_data_folder_path";
       }
    if (!fs.existsSync(`${output_folder_path}/${raw_data_folder_path}`)) {
        fs.mkdirSync(`${output_folder_path}/${raw_data_folder_path}`, {
            recursive: true
        });
    }
    let file_path = '';
    if(write_type == 'raw_data'){
        file_path = `${output_folder_path}/${raw_data_folder_path}/${file_name}`;
    } else{
        file_path = `${output_folder_path}/${file_name}`
    }
    
    let parsed_data = JSON.stringify(node_details);
    fs.writeFile(file_path, parsed_data, 'utf8', function () {
        log.info(`Uploaded ${file_path}`)
    });
}

// function to fetch catchpoint node details,once token is received 
async function fetch_current_session_node_data(){
    let token = await get_catchpoint_token(client_key, client_secret);
    let node_details = await fetch_catchpoint_node_deatils(token);
    return node_details;
}

// function to check changes in node details from current session in respect to previous session run
async function check_node_field_changes() {
    try {
        let current_session_node_details = await fetch_current_session_node_data();
        let previous_session_node_details = await read_previous_session_node_data();
        if (previous_session_node_details) {
            write_raw_and_result_node_details('raw_data', raw_file_previous_session, previous_session_node_details)
            if (lookUp_fields === undefined || !lookUp_fields.length) {
                lookUp_fields = default_lookup_fields;
            }
            for (let index = 0; index < lookUp_fields.length; index++) {
                let lookup_field = lookUp_fields[index];
                let changed_nodes = compare_node_data(previous_session_node_details, current_session_node_details, lookup_field);
                if (changed_nodes.length) {
                    write_raw_and_result_node_details('result_data', `changes_in_${lookup_field}.json`, changed_nodes)
                } else {
                    log.info(" No Changes ")
                    let empty_result = []
                    write_raw_and_result_node_details('result_data', `changes_in_${lookup_field}.json`, empty_result)
                }
            }
        }
        write_raw_and_result_node_details('raw_data',raw_file_current_session, current_session_node_details)
    }
    catch (err) {
        let error = new Error(err);
        log.error(error);
    }
}

export {
    check_node_field_changes,write_raw_and_result_node_details, compare_node_data
}
