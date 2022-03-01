# from configparser import ConfigParser
import os
import logging
import sys
current_working_directory = os.getcwd()
sys.path.insert(0, current_working_directory+'/libs')
sys.path.insert(0, current_working_directory+'/utils')
from common import check_node_field_changes
from logger import info_logger,error_logger

## Main function
try:
    check_node_field_changes()
except Exception as e:
    error_logger.exception(str(e))
