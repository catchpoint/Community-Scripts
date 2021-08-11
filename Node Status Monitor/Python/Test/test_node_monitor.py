# dependent packages and files required
import os, sys
lib_path = os.path.abspath(os.path.join('../','api'))
sys.path.append(lib_path)
from api_helper import fetch_node_details, get_token, write_node_data, compare_node_status, read_node_previous_run_data, write_node_status_change_result, process_node_details
import unittest
sys.path.append('..')
import json
from os import path
from configparser import ConfigParser

# Configuration
config = ConfigParser()
# -------Auth-----------
config.read(os.path.join(os.path.abspath(os.path.dirname(__file__)),'..','config.cfg'))
client_key=config.get('auth','client_key')
client_secret=config.get('auth','client_secret')

# ---------Instance----------
get_nodes_url=config.get('instance', 'nodes_url')
token_url=config.get('instance','token_url')

# ---------Files----------
new_data_file='../'+config.get('files','new_data_file')
old_data_file='../'+config.get('files','old_data_file')
result_file='../'+config.get('files','result_file')

class TestNodeMonitor(unittest.TestCase):

# test function to check token is getting generated or not
    def test_get_token(self):
        token=get_token(token_url,client_key,client_secret)
        assert len(token) >10

# test function to fetch data from api
    def test_fetch_node_details(self):
        token=get_token(token_url,client_key,client_secret)
        node_details=fetch_node_details(get_nodes_url,token)
        assert len(node_details.get('items'))>0

# test function to check wheather it returns data in correct format
    def test_process_data(self):
        input_node_data={'items':[{'id': 1, 'name': 'node1', 'status': {'id': 0, 'name': 'Active'}, 'network_type': {'id': 0, 'name': 'backbone'},'ip_ranges': '4.35.35.102', 'isp': {'id': 5, 'name': 'Level3'}, 'asn': {'value': 'AS3356', 'name': 'LEVEL3'},'city': {'id': 1, 'name': 'Las Vegas'}, 'region': {'id': 32, 'name': 'Nevada'}, 'country': {'id': 224, 'name': 'United States'},'continent': {'id': 1, 'name': 'North America'}, 'targeted': True, 'coordinates': {'latitude': 36.175, 'longitude': -115.1372}}]}
        output_node_data=[{'id': 1, 'node_name': 'node1', 'status': 'Active', 'network_type': 'backbone'}]
        data=process_node_details(input_node_data)
        assert process_node_details(input_node_data) == output_node_data
    
# test function to find difference in the data from previous version
    def test_compare_node_status(self):
        input_node_data1=json.dumps([{'id': 1, 'node_name': 'node1', 'status': 'Active', 'network_type': 'backbone'}])
        input_node_data2=[{'id': 1, 'node_name': 'node1', 'status': 'Active', 'network_type': 'backbone'}]
        input_node_data3=[{'id': 1, 'node_name': 'node1', 'status': 'Act', 'network_type': 'backbone'}]
        output_node_data1=compare_node_status(input_node_data1,input_node_data2,old_data_file,new_data_file)
        output_node_data2=compare_node_status(input_node_data1,input_node_data3,old_data_file,new_data_file)
        assert len(output_node_data1)==0
        assert len(output_node_data2)>0

#  test function to check wheather it writes the difference to result file   
    def test_write_node_status_change_result(self):
        data_to_write=[{'id': 1, 'node_name': 'node1', 'status': 'fail', 'network_type': 'backbone'}]
        write_node_status_change_result(data_to_write,result_file)
        result_file_exists=path.exists('../nodeData/result.json')
        assert result_file_exists==True

# test function to check wheather old and new data files got created orn not
    def test_write_node_data(self):
        data_to_write=[{'id': 1, 'node_name': 'node1', 'status': 'try', 'network_type': 'backbone'}]
        write_node_data(data_to_write,old_data_file,new_data_file)
        old_file_exists=path.exists('../nodeData/old_node_data.json')
        new_file_exists=path.exists('../nodeData/new_node_data.json')
        assert old_file_exists==True
        assert new_file_exists==True
        
if __name__ == '__main__':
    unittest.main()
