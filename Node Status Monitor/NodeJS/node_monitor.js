/* dependent packages and files required */
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
    process_node_status   :     function to process Node Details- Converts data into desired object
    write_data            :     function to write Node Details
    read_old_data         :     function to read old Node Details
    compare_data          :     function to compare  Node Details 
    get_token             :     function to get Access token 
*/

// Global Variable
var only_changed_data = config.only_changed_data; // if true get only changed node status, all node with status
const nodes_detail_url = config.nodes_detail_url;
const client_key = config.client_key;
const client_secret = config.client_secret;
// files
const new_data_file = config.files.new_data_file;
const old_data_file = config.files.old_data_file;
const result_file = config.files.result_file;

// main function to monitor node status
async function monitor_node_status() {
    try {
        let token = await get_token(client_key, client_secret);
        let node_details = await fetch_Data(token);
        let new_node_details = await process_node_status(node_details);
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

// function to fetch Node Details
function fetch_Data(token) {
    return new Promise((resolve, reject) => {
        log.info("-------------------- Fetching Node Details --------------------")
        fetch(nodes_detail_url, {
            headers: {
                'accept': 'application/json',
                'content-length': '0',
                'authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(json => {
                // if object has property Message ,display Error, else Process Data
                if (json.hasOwnProperty('Message')) {
                    log.error(`${json.Message}`);
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

// function to process Node Details,Converts data into desired object
function process_node_status(new_data) {
    log.info("-------------------- Processing Node Details --------------------")
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

// function to write Node Details to files
function write_data(data) {
    log.info("-------------------- Writing Node Details --------------------")
    let parsed_data = JSON.stringify(data);

    fs.writeFile(old_data_file, parsed_data, 'utf8', function () {
        log.info("-------------------- Writing old Node Details --------------------")
    });

    fs.writeFile(new_data_file, parsed_data, 'utf8', function () {
        log.info("-------------------- Writing new Node Details --------------------")
    });
}

// function to read old Node Details from file for comparing with latest Node Details.
function read_old_data() {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(old_data_file)) {
            log.info("-------------------- Reading old Node Details --------------------")
            fs.readFile(old_data_file, 'utf8', function readFileCallback(err, data) {
                if (err) {
                    reject(err);
                } else {
                    if (data) {
                        let old_data = JSON.parse(data);
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

// function to compare Node Details based on their status
function compare_data(old_data, new_data) {
    log.info("-------------------- Comparing Node Details --------------------")
    let compare_result = [];
    var updated_nodes = old_data.filter( old_node => {
        return new_data.some(new_node => {
            if (old_node.id == new_node.id) {
                return old_node.status != new_node.status
            };
        });
    });

    if (updated_nodes.length) {
        if (only_changed_data) {
            log.info("-------------------- Parsing only changed Node Details --------------------")
            let parsed_updated_nodes = JSON.stringify(updated_nodes)
            fs.writeFile(result_file, parsed_updated_nodes, 'utf8', function () {
                log.info(`Uploaded ${result_file}`)
            });
            write_data(new_data)
        } else {
            log.info("-------------------- Parsing all Node Details --------------------")
            new_data.forEach(item => {
                let found = updated_nodes.some(function (el) {
                    return el.id === item.id;
                });
                if (found) {
                    compare_result.push({ ...item, changed: true })
                } else {
                    compare_result.push({ ...item, changed: false })
                }
            })
            let parsed_compare_result = JSON.stringify(compare_result)
            fs.writeFile(result_file, parsed_compare_result, 'utf8', function () {
                log.info(`Uploaded ${result_file}`)
            });
            write_data(compare_result)
        }
    } else {
        log.info("-------------------- No Changes --------------------")
        let parsed_empty_result = JSON.stringify([])
        fs.writeFile(result_file, parsed_empty_result, 'utf8', function () {
            log.info(`Uploaded ${result_file}`)
        });
    }
}

monitor_node_status();

export {
    process_node_status,
    write_data,
    compare_data,
    read_old_data,
    fetch_Data
}
