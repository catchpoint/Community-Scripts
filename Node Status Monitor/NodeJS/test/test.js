// dependent packages and files required
import { expect } from 'chai';
import fs from 'fs';
import { write_raw_and_result_node_details, compare_node_data,check_node_field_changes} from '../libs/common.js';
import {get_catchpoint_token} from '../libs/api.js';
import config from '../config/config.js';
import constant from '../utils/application_constants.js';

// Catchpoint Credentials
let client_key = config.client_key;
let client_secret = config.client_secret;
// Output files and location
const raw_file_current_session = constant.raw_files_path.current_session;

// test function to check generation of token
describe('test_get_token', ()=>{
    it('test_get_token', async()=>{
        const token = await get_catchpoint_token(client_key, client_secret);
        expect(token).to.not.be.undefined;
    });
});

// test function to check wheater old file exists  to be read
describe('test_read_old_data', ()=>{
    it('test_read_old_data', ()=>{
        let old_file_exists=fs.existsSync('output/details/new_node_data.json');
        expect(old_file_exists).to.be.true;
    });
});


// test function to check wheather output file has been created or present for output to be written
describe('test_write_data', ()=>{
    it('test_write_data', ()=>{
    let input_data=[
        {
            "id": 1,
            "name": "Las Vegas, US - Level3",
            "status": {
                "id": 0,
                "name": "Active"
            },
            "network_type": {
                "id": 0,
                "name": "Backbone"
            },
            "ip_ranges": "4.35.35.102",
            "isp": {
                "id": 5,
                "name": "Level3"
            },
            "asn": {
                "value": "AS3356",
                "name": "LEVEL3"
            },
            "city": {
                "id": 1,
                "name": "Las Vegas"
            },
            "region": {
                "id": 32,
                "name": "Nevada"
            },
            "country": {
                "id": 224,
                "name": "United States"
            },
            "continent": {
                "id": 1,
                "name": "North America"
            },
            "targeted": true,
            "coordinates": {
                "latitude": 36.175,
                "longitude": -115.1372
            }
        }]
        write_raw_and_result_node_details('raw_data',raw_file_current_session, input_data);
        let file_exists=fs.existsSync('output/details/new_node_data.json');
        expect(file_exists).to.be.true;
    });
});

// test function to compare difference in different node data
describe('test_compare_data', ()=>{
    it('test_compare_data', ()=>{
    let input_data1=[
        {
            "id": 1,
            "name": "Las Vegas, US - Level3",
            "status": {
                "id": 0,
                "name": "Active"
            },
            "network_type": {
                "id": 0,
                "name": "Backbone"
            },
            "ip_ranges": "4.35.35.102",
            "isp": {
                "id": 5,
                "name": "Level3"
            },
            "asn": {
                "value": "AS3356",
                "name": "LEVEL3"
            },
            "city": {
                "id": 1,
                "name": "Las Vegas"
            },
            "region": {
                "id": 32,
                "name": "Nevada"
            },
            "country": {
                "id": 224,
                "name": "United States"
            },
            "continent": {
                "id": 1,
                "name": "North America"
            },
            "targeted": true,
            "coordinates": {
                "latitude": 36.175,
                "longitude": -115.1372
            }
        }]
    let input_data2=[
        {
            "id": 1,
            "name": "Las Vegas, US - Level3",
            "status": {
                "id": 0,
                "name": "Active"
            },
            "network_type": {
                "id": 0,
                "name": "Backbone"
            },
            "ip_ranges": "4.35.35.102",
            "isp": {
                "id": 5,
                "name": "Level3"
            },
            "asn": {
                "value": "AS3356",
                "name": "LEVEL3"
            },
            "city": {
                "id": 1,
                "name": "Las Vegas"
            },
            "region": {
                "id": 32,
                "name": "Nevada"
            },
            "country": {
                "id": 224,
                "name": "United States"
            },
            "continent": {
                "id": 1,
                "name": "North America"
            },
            "targeted": true,
            "coordinates": {
                "latitude": 36.175,
                "longitude": -115.1372
            }
        }]
    let input_data3=[
        {
            "id": 1,
            "name": "Las Vegas, US - Level3",
            "status": {
                "id": 0,
                "name": "inActive"
            },
            "network_type": {
                "id": 0,
                "name": "Backbone"
            },
            "ip_ranges": "4.35.35.102",
            "isp": {
                "id": 5,
                "name": "Level3"
            },
            "asn": {
                "value": "AS3356",
                "name": "LEVEL3"
            },
            "city": {
                "id": 1,
                "name": "Las Vegas"
            },
            "region": {
                "id": 32,
                "name": "Nevada"
            },
            "country": {
                "id": 224,
                "name": "United States"
            },
            "continent": {
                "id": 1,
                "name": "North America"
            },
            "targeted": true,
            "coordinates": {
                "latitude": 36.175,
                "longitude": -115.1372
            }
        }
    ]
    let no_change_data=  compare_node_data(input_data1,input_data2,'status.name');
    let node_status_changed_data= compare_node_data(input_data2,input_data3,'status.name');
    expect(no_change_data.length == 0).to.be.true;
    expect(node_status_changed_data.length >= 1).to.be.true;
    });
});
