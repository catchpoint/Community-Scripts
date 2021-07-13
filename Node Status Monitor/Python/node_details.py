from configparser import ConfigParser
from api_helper import fetch_node_details,gen_token,write_node_data,compare_node_status,read_node_previous_run_data,write_node_status_change_result
from process_data import process_node_details
import os
import logging

# congiguration
config = ConfigParser()
logging.basicConfig(filename='app.log',level=logging.INFO)
# logging.basicConfig(filename='error.log',level=logging.Error)
# -------Auth-----------
config.read('config.cfg')
client_key=config.get('auth','client_key')
client_secret=config.get('auth','client_secret')

# ---------Instance----------
get_nodes_url=config.get('instance', 'nodes_url')
token_url=config.get('instance','token_url')

# ---------Files----------
new_data_file=config.get('files','new_data_file')
old_data_file=config.get('files','old_data_file')
result_file=config.get('files','result_file')

# functions:
#         Function Name                            Description
#     fetch_node_details               :     function to fetch Node Details
#     process_node_details             :     function to process Node Details
#     write_node_data                  :     function to write Node Details
#     read_node_previous_run_data      :     function to read old Node Details
#     compare_node_status              :     function to compare  Node Details
#     write_node_status_change_result  :     function to write the differences spotted
#     gen_token                        :     function to get Access token 
    
# Files:
#         FileName                        Description
#     new_node_data.json    :      Json Format Result with Node's changed Status
#     old_node_data.json    :      Json Format Data Node's status Previous run
#     result.json           :      Json Format Data Node's status Current run

# Execution Part starts Here
try:
    # get Token
    token=gen_token(token_url,client_key,client_secret)
    if token:
        get_new_node_details=fetch_node_details(get_nodes_url,token)
        new_node_details=process_node_details(get_new_node_details)
        old_node_details = read_node_previous_run_data()
        if old_node_details:
            if(os.stat(old_data_file).st_size == 0):
                write_node_data(new_node_details)
            else:
                status_result = compare_node_status(old_node_details,new_node_details)
                write_node_status_change_result(status_result)
        else:
            write_node_data(new_node_details)
    else:
        logging.error("error generating token")
except Exception as e:
    logging.exception(str(e))