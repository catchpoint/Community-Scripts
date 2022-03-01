import json
import logging
from configparser import ConfigParser
import os.path
from os import path
import application_constants
from api import get_catchpoint_token,fetch_catchpoint_node_deatils
from logger import info_logger,error_logger


# Config
config = ConfigParser()
config.read(os.path.join(os.path.dirname(__file__), '../config', 'config.cfg'))
if config.has_option('monitor','lookup_fields'):
    lookup_fields_for_comparison = json.loads(config.get('monitor','lookup_fields'))
    if len(lookup_fields_for_comparison) == 0 :
        lookup_fields_for_comparison = application_constants.default_lookup_fields
else:
    lookup_fields_for_comparison = application_constants.default_lookup_fields

# Catchpoint Credentials 
client_key=config.get('auth','client_key')
client_secret=config.get('auth','client_secret')

# Catchpoint API URLs for token and node info 
get_nodes_url=application_constants.nodes_url
token_url=application_constants.token_url

# Output files and location
current_session_data_file=application_constants.current_session_data_file
previous_session_data_file=application_constants.previous_session_data_file
current_working_directory = os.getcwd()
output_folder_path=application_constants.output_folder_path
raw_data_folder_path=application_constants.raw_data_folder_path
path = os.path.join(current_working_directory, output_folder_path)
sub_path=os.path.join(path,raw_data_folder_path)


# function to write raw Node Data to file 
def write_node_data_to_file(node_data, file):
    try:
        node_dump_data= json.dumps(node_data)
        if not os.path.isdir(path):
            os.makedirs(sub_path)
        else:
            if not os.path.isdir(sub_path):
                os.mkdir(sub_path)    
        info_logger.info(" writing Node Details for "+ file )
        previous_session_file = open(os.path.join(sub_path,file),'w',encoding = 'utf-8')
        previous_session_file.write(str(node_dump_data)) 
        previous_session_file.close()
    except Exception as e:
        error_logger.exception(str(e))

# function to write changed Node results
def write_changes_in_node_result(node_data,comparator):
    info_logger.info(" writing result ")
    try:
        changed_data= json.dumps(node_data)
        if not os.path.isdir(path):
            os.mkdir(path)
        opened_result_file = open(os.path.join(path, "changes_in_"+comparator+".json"),'w',encoding = 'utf-8')
        opened_result_file.write(str(changed_data)) 
        opened_result_file.close()
    except Exception as e:
        error_logger.exception(str(e))

# function to read old Node Details
def read_previous_session_node_data():
    previous_session_node_details=[]
    try:
        info_logger.info(" reading previous session node details ")
        if os.path.exists(os.path.join(sub_path,current_session_data_file)):           
            previous_session_file = open(os.path.join(sub_path,current_session_data_file),'r',encoding = 'utf-8') 
            previous_session_node_details = previous_session_file.read()
        return previous_session_node_details
    except Exception as e:
        error_logger.exception(str(e))

# function to get value for set of keys from an nested object
def get_value_for_lookUp_fields(node,keys):
    value =''
    for key in keys:
        if key in node:
            if value == '':
                value = node[key]
            else:
                value = value[key]
    return value

# function to compare  Node Details
def compare_node_status(previous_session_data,current_session_data,lookup_field):
    try:
        info_logger.info(" Comparing Node Details ")
        previous_session_node_details= json.loads(previous_session_data)
        def compare(current_session_data_dataObj):
            for node_index in range(0,len(previous_session_node_details)):
                if current_session_data_dataObj['id'] == previous_session_node_details[node_index]['id']:
                    keys=lookup_field.split('.')
                    previous_run_data=get_value_for_lookUp_fields(previous_session_node_details[node_index],keys)
                    current_run_data=get_value_for_lookUp_fields(current_session_data_dataObj,keys)
                    return previous_run_data!=current_run_data
            return True
        unique_result = list(filter(compare,current_session_data))
        if not unique_result:
           info_logger.info(" no change ")
        else:
             write_node_data_to_file(current_session_data,current_session_data_file)
        return unique_result
    except Exception as e:
        error_logger.exception(str(e))

# function to fectch current seesion data from catchpoint node api
def fetch_current_session_node_data():
    token=get_catchpoint_token(token_url,client_key,client_secret)
    if token:
        node_details=fetch_catchpoint_node_deatils(get_nodes_url,token)
    return node_details

# function to check changes in node details from current session in respect to previous session run
def check_node_field_changes():
    current_session_node_details = fetch_current_session_node_data() 
    previous_session_node_details = read_previous_session_node_data() 
    if previous_session_node_details:
        write_node_data_to_file(json.loads(previous_session_node_details),previous_session_data_file) 
        if(os.stat(os.path.join(sub_path,current_session_data_file)).st_size == 0):
            write_node_data_to_file(current_session_node_details,current_session_data_file) 
        else:
            for lookup_field in lookup_fields_for_comparison:
                status_result = compare_node_status(previous_session_node_details,current_session_node_details,lookup_field) 
                write_changes_in_node_result(status_result,lookup_field)
    else:
        write_node_data_to_file(current_session_node_details,current_session_data_file) 
