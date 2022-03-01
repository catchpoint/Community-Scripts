import logging
import os
import application_constants
formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')

# logger folder path
logger_info_folder_path = application_constants.logger_info_folder_path
logger_error_folder_path = application_constants.logger_error_folder_path
logger_info_file_Name = application_constants.logger_info_file_Name
logger_error_file_Name = application_constants.logger_error_file_Name

# function to check if logger folder exists
def create_logger_folder(folder_path):
    if not os.path.isdir(folder_path):
        os.makedirs(folder_path, exist_ok=True)

#
def setup_logger(name, log_file, level=logging.INFO):
    # create_logger_folder('logs')
    create_logger_folder(logger_info_folder_path)
    create_logger_folder(logger_error_folder_path)
    handler = logging.FileHandler(log_file)        
    handler.setFormatter(formatter)
    logger = logging.getLogger(name)
    logger.setLevel(level)
    logger.addHandler(handler)
    return logger

info_logger = setup_logger('info_logger', logger_info_folder_path+logger_info_file_Name,logging.INFO)
error_logger = setup_logger('error_logger', logger_error_folder_path+logger_error_file_Name,logging.ERROR)
