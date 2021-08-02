# dependent packages and files required
import os, sys
import requests
import time
import urllib.request
import urllib.parse
import json
import logging
from configparser import ConfigParser
import os.path
from os import path

# function to get authentication token 
def get_token(token_Url,client_key, client_secret):
            logging.info("-------------------- Getting Token  --------------------")
            values = {'grant_type': 'client_credentials', 'client_id': client_key, 'client_secret': client_secret}
            data = urllib.parse.urlencode(values)
            data = data.encode('utf-8')
            req = urllib.request.Request(token_Url, data)
            req.add_header('accept', 'application/json')
            token_value = ''
            response = urllib.request.urlopen(req)
            result = response.read().decode('utf-8')
            json_result = json.loads(result)
            token_value = json_result['access_token']
            return token_value

# function to fetch Node Details from catchpoint api
def fetch_node_details(url, token):
    logging.info("-------------------- Fetching Node Details  --------------------")
    try:
        headers = {'content-length': '0',
           'accept': 'application/json',
           'authorization': 'Bearer {}'.format(token)
           }
        response = requests.get(
            url,headers=headers)
        if response:
            data = response.json()
            return data
    except Exception as e:
        logging.exception(str(e))

# function to write Node Details to files
def write_node_data(node_data,old_data_file,new_data_file):
    try:
        node_dump_data= json.dumps(node_data)
        logging.info("-------------------- Writing old Node Details  --------------------")
        old_file = open(old_data_file,'w',encoding = 'utf-8')
        old_file.write(str(node_dump_data)) 
        old_file.close()
        logging.info("-------------------- Writing new Node Details  --------------------")
        new_file = open(new_data_file,'w',encoding = 'utf-8')
        new_file.write(str(node_dump_data)) 
        new_file.close()
    except Exception as e:
        logging.exception(str(e))

# function to write Node Details result to file
def write_node_status_change_result(node_data,result_file):
    logging.info("-------------------- Writing Result --------------------")
    try:
        result_data= json.dumps(node_data)
        opened_result_file = open(result_file,'w',encoding = 'utf-8')
        opened_result_file.write(str(result_data)) 
        opened_result_file.close()
    except Exception as e:
        logging.exception(str(e))

# function to read old Node Details
def read_node_previous_run_data(old_data_file):
    old_node_details=[]
    try:
        logging.info("-------------------- Reading old Node Details --------------------")
        if path.exists(old_data_file):           
            old_file = open(old_data_file,'r',encoding = 'utf-8') 
            old_node_details = old_file.read()
        return old_node_details
    except Exception as e:
        logging.exception(str(e))


# function to compare  Node Details
def compare_node_status(old_data,new_data,old_data_file,new_data_file):
    try:
        logging.info("-------------------- Comparing Node Details --------------------")
        old_node_details= json.loads(old_data)
        def compare(old_node_dataObj):
            for node_index in range(0,len(new_data)):
                if old_node_dataObj['id'] == new_data[node_index]['id']:
                    return old_node_dataObj['status'] != new_data[node_index]['status']
            return True
     
        unique_result = list(filter(compare,old_node_details))
        if not unique_result:
           logging.info("-------------------- No Change --------------------")
        else:
             write_node_data(new_data,old_data_file,new_data_file)
        return unique_result
    except Exception as e:
        logging.exception(str(e))
