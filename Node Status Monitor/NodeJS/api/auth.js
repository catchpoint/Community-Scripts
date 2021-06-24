import fetch from 'node-fetch';
import config from '../config/config.js';
import log from '../utils/logger.js';

let token_url = config.token_url;

/*
funtion to get New Token
*/
function get_token(clientId, clientSecret) {
  return new Promise((resolve, reject) => {
    log.info("-------------------- geting token  --------------------")
    fetch(token_url,
      {
        method: 'POST',
        body: 'grant_type=client_credentials&client_id=' + clientId + '&client_secret=' + clientSecret,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .then(res => res.json())
      .then(json => {
        if (json.hasOwnProperty('Message')) {
          throw json.Message;
        } else {
          log.info("-------------------- recived token  --------------------");
          resolve(json.access_token)
        }
      }).catch(err => {
        reject(err);
      }
      );
  });
}

//  function validate token(access_token)
function valid_token() {
  const now = Date.now() / 1000;
  const expiry = token.created_at + token.expires_in;
  return now < expiry;
}

//  function store token(access_token)
function store_token(token) {
  config["token"] = { ...token, created_at: Date.now() / 1000 };
}

export {
  get_token,
  valid_token,
  store_token
}