Node Status Monitor (NodeJS)
===================

This document provides instructions for installing and using the NodeJS version of Catchpoint's Node Status Monitor. For general information about Node Status Monitor, see the main [README](https://github.com/Schultztw/Community-Scripts/blob/June2021_NodeStatusMonitor/Node%20Status%20Monitor/README.md).

Prerequisites
-------------------------------

1. NodeJs 14.17.0+  [Download NodeJs](https://nodejs.org/en/download/)
2. npm 6.14.13+

Installation
------------

1. Copy this folder `/NodeJS` and all of its contents to the machine that you want to run the Node Status Monitor.
2. Run 'npm install' in the package directory `/NodeJS`.

Credentials
-----------

To retrieve data from Catchpoint's REST API, you must first add your Key and Secret to the `/config.js` file.

1. Find your Key and Secret in the [Catchpoint Portal](https://portal.catchpoint.com/ui/Content/Administration/ApiDetail.aspx).
2. Copy your Key and Secret to the respective mappings within `/config.js`:
  
```  javascript
1  var config = {
2    client_key: '<your key>',
3    client_secret: '<your secret>',  
```

How To Run
-----------

1. Run `npm start` in the package directory

or

1. `npm install`
1. `mkdirp output`
1. `node node_monitor.js`

How to Run Unit Test Cases
--------------------------

1. Run `npm test` in the package directory

File Structure [Before Execution]
-----------------------------------

```sh
NodeJs/
├── src
| ├── auth.js             ## Authentication API processing
| ├── config.js           ## Configuration
| ├── logger.js           ## Logger setup
| ├── node_monitor.js     ## Main file
├── tests
| ├── full.js             ## Unit tests
├── package.json          ## Project dependencies
└── Readme.md             ## This file
```

File Structure [After Execution]
-----------------------------------

```sh
NodeJs/
├── src
| ├── auth.js             ## Authentication API processing
| ├── config.js           ## Configuration
| ├── logger.js           ## Logger setup
| ├── node_monitor.js     ## Main file
├── output
| ├── info.log            ## Contains informational logs. File name will be based on date of execution
| ├── error.log           ## Contains error logs. File name will be based on date of execution
| ├── new_node_data.json  ## Output file - contains Node status from the current run in JSON format
| ├── old_node_data.json  ## Output file - contains Node status from the previous run in JSON format
| ├── result.json         ## Output file - contains Nodes' changed status in JSON format (generated from comparison of new and old node data)
├── tests
| ├── full.js             ## Unit tests
├── package.json          ## Project dependencies
└── Readme.md             ## This file

```

Output
-------

* **`/output/new_node_data.json`**    : Contains Node status from the current run in JSON format
* **`/output/old_node_data.json`**    : Contains Node status from the previous run in JSON format
* **`/output/result.json`**           : Contains Nodes' changed status in JSON format (generated from comparison of new and old node data)

Note
-----

* `/output/result.json` will not be created the first time you run Node Status Monitor as there will be no old node data to compare.
