import requests
import time
import urllib.request
import urllib.parse
import json
from logger import info_logger,error_logger


# Function to get authentication token from catchpoint api
def get_catchpoint_token(token_Url,client_key, client_secret):
    info_logger.info("geting token ")
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
    if token_value:
        info_logger.info("received token")
        return token_value
    else:
        info_logger.info(" invalid token ")
        return None

# function to fetch Node Details
def fetch_catchpoint_node_deatils(url, token):
    info_logger.info("fetching Node Details")
    try:
        headers = {'content-length': '0',
           'accept': 'application/json',
           'authorization': 'Bearer {}'.format(token)
           }
        response = requests.get(
            url,headers=headers)
        if response:
            data = response.json()
            return data['items']
    except Exception as e:
        error_logger.exception(str(e))
