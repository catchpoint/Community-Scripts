# dependent packages and files required
import os, sys
lib_path = os.path.abspath(os.path.join('./','libs'))
logger_path = os.path.abspath(os.path.join('./','utils'))
sys.path.append(lib_path)
sys.path.append(logger_path)
from api import get_catchpoint_token,fetch_catchpoint_node_deatils
from logger import info_logger,error_logger
from common import write_node_data_to_file, compare_node_status
import unittest
sys.path.append('..')

import json
from os import path

from configparser import ConfigParser
import application_constants

# Configuration
config = ConfigParser()
# Catchpoint Credentials 
config.read(os.path.join(os.path.abspath(os.path.dirname(__file__)),'..','config/config.cfg'))
client_key=config.get('auth','client_key')
client_secret=config.get('auth','client_secret')

# Catchpoint API URLs for token and node info 
get_nodes_url=application_constants.nodes_url
token_url=application_constants.token_url

# Output files and location
current_session_data_file=application_constants.current_session_data_file


class TestNodeMonitor(unittest.TestCase):

# test function to check token is getting generated or not
    def test_get_token(self):
        token=get_catchpoint_token(token_url,client_key,client_secret)
        assert len(token) >10


# test function to fetch data from api
    def test_fetch_node_details(self):
        token=get_catchpoint_token(token_url,client_key,client_secret)
        node_details=fetch_catchpoint_node_deatils(get_nodes_url,token)
        assert len(node_details)>0

   
# test function to find difference in the data from previous version
    def test_compare_node_status(self):
        input_node_data1=json.dumps([
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
            "targeted": 'true',
            "coordinates": {
                "latitude": 36.175,
                "longitude": -115.1372
            }
        }])
        input_node_data2=[
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
            "targeted": 'true',
            "coordinates": {
                "latitude": 36.175,
                "longitude": -115.1372
            }
        }]
        input_node_data3=[
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
            "targeted": 'true',
            "coordinates": {
                "latitude": 36.175,
                "longitude": -115.1372
            }
        }]
        output_node_data1=compare_node_status(input_node_data1,input_node_data2,'status.name')
        output_node_data2=compare_node_status(input_node_data1,input_node_data3,'status.name')
        assert len(output_node_data1)==0
        assert len(output_node_data2)>0


# test function to check wheather old and new data files got created orn not
    def test_write_node_data(self):
        data_to_write=[{'id': 1, 'node_name': 'node1', 'status': 'try', 'network_type': 'backbone'}]
        write_node_data_to_file(data_to_write,current_session_data_file)
        new_file_exists=path.exists('./output/details/new_node_data.json')
        assert new_file_exists==True
        
if __name__ == '__main__':
    unittest.main()
