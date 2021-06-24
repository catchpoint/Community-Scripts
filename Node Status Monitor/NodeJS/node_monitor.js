/* imports*/
import fetch from 'node-fetch';
import fs from 'fs';
import log from './utils/logger.js';
import { get_token } from './api/auth.js';
import config from './config/config.js';


/* 
variables:
        Key                             Description
    Only_changed_data :  if true get only changed node status, all node with status
    
functions:
        Function Name                   Description
    fetch_Data            :     function to fetch Node Details
    process_node_status   :     function to process Node Details
    write_data            :     function to write Node Details
    read_old_data         :     function to read old Node Details
    compare_data          :     function to compare  Node Details 
    get_token             :     function to get Access token 
    
Files:
        FileName                        Description
    new_node_data.json    :      Json Format Result with Node's changed Status
    old_node_data.json    :      Json Format Data Node's status Previous run
    result.json         :      Json Format Data Node's status Current run  
*/




/* Gobal Variable */
var only_changed_data = true; // if true get only changed node status, all node with status

let nodes_detail_url = config.nodes_detail_url;
let client_key = config.client_key;
let client_secret = config.client_secret;
// files
let new_data_file = config.files.new_data_file;
let old_data_file = config.files.old_data_file;
let result_file = config.files.result_file;

/* function call */
get_node_details();


async function get_node_details() {
    try {
        let token = await get_token(client_key, client_secret);
        let get_new_node_details = await fetch_Data(token);
        let new_node_details = await process_node_status(get_new_node_details);
        let old_node_details = await read_old_data();
        if (!old_node_details) {
            write_data(new_node_details);
        } else {
            compare_data(old_node_details, new_node_details);
        }
        return new_node_details
    }
    catch (err) {
        let error = new Error(err);
        log.error(error);
    }
}

/*function to fetch Node Details */
function fetch_Data(token) {
    return new Promise((resolve, reject) => {
        log.info("-------------------- fetching Node Details --------------------")
        fetch(nodes_detail_url, {
            headers: {
                'accept': 'application/json',
                'content-length': '0',
                'authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(json => {
                // if object has propeery Message ,display Error, else Process Data
                if (json.hasOwnProperty('Message')) {
                    log.error(`************************* ${json.Message} *************************`);
                    reject(json.Message)
                } else {
                    resolve(json.items)
                }

            }).catch(err => {
                reject(err)
            }
            );
    });
}

/*function to process Node Details */
function process_node_status(new_data) {
    log.info("-------------------- processing Node Details --------------------")
    let new_node_data = new_data.map(item => {
        return {
            id: item.id,
            node_name: item.name,
            status: item.status.name,
            network_type: item.network_type.name
        }
    });

    return new_node_data;
}

/*function to write Node Details */
function write_data(data) {
    log.info("-------------------- writing  Node Details --------------------")
    let parsed_data = JSON.stringify(data);

    fs.writeFile(old_data_file, parsed_data, 'utf8', function () {
        log.info("-------------------- writing Old Node Details --------------------")
    });

    fs.writeFile(new_data_file, parsed_data, 'utf8', function () {
        log.info("-------------------- writing New Node Details --------------------")
    });
}

/*function to read old Node Details */
function read_old_data() {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(old_data_file)) {
            // Do something
            log.info("-------------------- Reading Old Node Details --------------------")
            fs.readFile(old_data_file, 'utf8', function readFileCallback(err, data) {
                if (err) {
                    reject(err);
                } else {
                    if (data) {
                        let old_data = JSON.parse(data); //now it an object
                        resolve(old_data)
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

/*function to compare  Node Details */
function compare_data(old_data, new_data) {
    log.info("-------------------- Comparing  Node Details --------------------")
    let temp = [];
    var unique_status_change_node_result = old_data.filter(function (obj) {
        return new_data.some(function (obj2) {
            if (obj.id == obj2.id) {
                return obj.status != obj2.status
            };
        });
    });

    if (unique_status_change_node_result.length) {
        if (only_changed_data) {
            log.info("-------------------- getting only changed  Node Details --------------------")
            let parsed_data = JSON.stringify(unique_status_change_node_result)
            fs.writeFile(result_file, parsed_data, 'utf8', function () {
                log.info("uploaded result.json")
            });
            write_data(new_data)
        } else {
            log.info("-------------------- getting all  Node Details with new status --------------------")
            new_data.forEach(item => {
                let found = unique_status_change_node_result.some(function (el) {
                    return el.id === item.id;
                });
                if (found) {
                    temp.push({ ...item, changed: true })
                } else {
                    temp.push({ ...item, changed: false })
                }
            })
            //  return temp

            let parsed_temp = JSON.stringify(temp)
            fs.writeFile(result_file, parsed_temp, 'utf8', function () {
                log.info("uploaded result.json")
            });
            write_data(temp)
        }
    } else {
        log.info("-------------------- No Chnages --------------------")
        let parsed_temp = JSON.stringify([])
        fs.writeFile(result_file, parsed_temp, 'utf8', function () {
            log.info("uploaded result.json")
        });
    }
}
