// dependent packages and files required
import fetch from 'node-fetch';
import config from '../config/config.js';
import log from '../utils/logger.js';

const token_url = config.token_url;

/*
Function to get Authentication token
*/
function get_token(clientId, clientSecret) {
  return new Promise((resolve, reject) => {
    log.info("-------------------- Getting token  --------------------")
    fetch(token_url,
      {
        method: 'POST',
        body: 'grant_type=client_credentials&client_id=' + clientId + '&client_secret=' + clientSecret,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .then(res => res.json())
      .then(json => {
        // if object has property Message, log as error, otherwise process data
        if (json.hasOwnProperty('Message')) {
          throw json.Message;
        } else {
          log.info("-------------------- Received token  --------------------");
          resolve(json.access_token)
        }
      }).catch(err => {
        reject(err);
      }
      );
  });
}

export {
  get_token
}