// dependent packages and files required
import fetch from 'node-fetch';
import log from '../utils/logger.js';
import constant from '../utils/application_constants.js';

// Catchpoint API URLs for token and node info
const token_url = constant.token_url;
const nodes_detail_url = constant.nodes_detail_url;

// Function to get Authentication token from catchpoint api
function get_catchpoint_token(clientId, clientSecret) {
  return new Promise((resolve, reject) => {
    if(!clientId || !clientSecret){
      throw "Add vaild client_key and client_secret";
    }
    log.info(" Getting Token  ")
    fetch(token_url,
      {
        method: 'POST',
        body: 'grant_type=client_credentials&client_id=' + clientId + '&client_secret=' + clientSecret,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .then(res => res.json())
      .then(json => {
        // response errors are set in the Message property of the response.
        if (json.hasOwnProperty('Message')) {
          throw json.Message;
        } else {
          log.info(" Received Token  ");
          resolve(json.access_token)
        }
      }).catch(err => {
        log.error(err);
        reject(err);
      }
      );
  });
}

// function to fetch catchpoint Node Details
function fetch_catchpoint_node_deatils(token) {
    return new Promise((resolve, reject) => {
        log.info(" Fetching Node Details ")
        fetch(nodes_detail_url, {
            headers: {
                'accept': 'application/json',
                'content-length': '0',
                'authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(json => {
                // if object has property Message ,display Error, else Process Data
                if (json.hasOwnProperty('Message')) {
                    log.error(json.Message);
                    reject(json.Message)
                } else {
                    log.info(" Received Node Details ");
                    resolve(json.items)
                }
            }).catch(err => {
              log.error(err);
              reject(err)
            }
            );
    });
}

export {
  get_catchpoint_token,
  fetch_catchpoint_node_deatils
}
