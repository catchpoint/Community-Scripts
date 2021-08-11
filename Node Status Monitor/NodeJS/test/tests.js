// dependent packages and files required
import { expect } from 'chai';
import fs from 'fs';
import { process_node_status, write_data, compare_data } from '../src/node_monitor.js';
import { get_token } from '../src/auth.js';
import config from '../src/config.js';
let client_key = config.client_key;
let client_secret = config.client_secret;


// check generation of token
describe('test_get_token', () => {
    it('test_get_token', async () => {
        const token = await get_token(client_key, client_secret);
        expect(token).to.not.be.undefined;
    });
});

// check whether data was processed in correct format or not
describe("test_process_node_status", () => {
    it('test_process_node_status', async () => {
        let input_data = [{
            id: 1,
            name: "node1",
            status: { name: "active" },
            network_type: { name: 'backbone' }
        }];
        let output_data = [{
            id: 1,
            node_name: "node1",
            status: "active",
            network_type: "backbone"
        }]
        let data = process_node_status(input_data);
        expect(data).to.eql(output_data);
    });
});

// check whether old file exists  to be read
describe('test_read_old_data', () => {
    it('test_read_old_data', () => {
        let old_file_exists = fs.existsSync('output/old_node_data.json');
        expect(old_file_exists).to.be.true;
    });
});


// check whether output file has been created or present for output to be written
describe('test_write_data', () => {
    it('test_write_data', () => {
        let input_data = [
            {
                id: 1,
                node_name: 'Las Vegas, US - Level3',
                status: 'Active',
                network_type: 'Backbone'
            }]
        write_data(input_data);
        let file_exists = fs.existsSync('output/new_node_data.json');
        expect(file_exists).to.be.true;
    });
});

// compare difference in different node data
describe('test_compare_data', () => {
    it('test_compare_data', () => {
        let input_data1 = [
            {
                id: 1,
                node_name: 'Las Vegas, US - Level3',
                status: 'Active',
                network_type: 'Backbone'
            }]
        let input_data2 = [
            {
                id: 1,
                node_name: 'Las Vegas, US - Level3',
                status: 'Active',
                network_type: 'Backbone'
            }]
        let input_data3 = [
            {
                id: 1,
                node_name: 'Las Vegas, US - Level3',
                status: 'Fail',
                network_type: 'Backbone'
            }
        ]
        compare_data(input_data1, input_data2);
        compare_data(input_data2, input_data3);
        let new_file_exists = fs.existsSync('output/new_node_data.json');
        let result_file_exists = fs.existsSync('output/result.json');
        expect(new_file_exists).to.be.true;
        expect(result_file_exists).to.be.true;
    });
});
