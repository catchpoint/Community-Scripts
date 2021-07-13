Node Status Monitor
===================

This document provides detailed instructions for installing and using the NodeJS version of Catchpoint's Node Status Monitor. For general information about Node Status Monitor, see the main [README](https://github.com/Schultztw/Community-Scripts/blob/June2021_NodeStatusMonitor/Node%20Status%20Monitor/README.md).

Prerequisites
-------------------------------

1. NodeJs - 14.17.0 +  [ [Download NodeJs](https://nodejs.org/en/download/) ]
2. npm    - 6.14.13 +

Installation
------------

Copy this folder (/NodeJS) and all of its contents to the machine that you want to run the Node Status Monitor.

Run 'npm install' in the package directory (/NodeJS).

Credentials
-----------

To retrieve data from Catchpoint's REST API, you must first add your Key and Secret to the /config/config.js file.

1. Find your Key and Secret in the [Catchpoint Portal](https://portal.catchpoint.com/ui/Content/Administration/ApiDetail.aspx).
2. Copy your Key and Secret to the respective mappings within /config/config.cfg:
  
```  
1  var config = {
2    client_key: '<your key>',
3    client_secret: '<your secret>',  
```

How To Run
-----------

1. Run 'npm start' in the package directory

or

1. npm install
2. node node_monitor.js

File Structure [Before Execution]
-----------------------------------

```
NodeJs/
├── api
| ├── auth.js             ## Contains APIs related to authentication
├── config
| ├── config.js           ## Configuration file
├── logs                  
| ├── info
| ├── error
├── nodeData
├── utils
| ├── logger.js           ## Logger utility
├──package.json           ## Project dependencies
└── node_monitor.js        ## Main file
```

File Structure [After Execution]
-----------------------------------

```
NodeJs/
├── api
| ├── auth.js             ## Contains APIs related to authentication
├── config
| ├── config.js           ## Configuration file
├── logs
| ├── info
| |  ├── info.log         ## Contains informational logs. File name will be based on date of execution
| ├── error
| |  ├── error.log        ## Contains error logs. File name will be based on date of execution
├── nodeData
| ├── new_node_data.json    ## Output file - contains Node status from the current run in JSON format
| ├── old_node_data.json    ## Output file - contains Node status from the previous run in JSON format
| ├── result.json         ## Output file - contains Nodes' changed status in JSON format (generated from comparison of new and old node data)
├── utils
| ├── logger.js           ## logger utility
├──package.json           ## project dependencies
└── node_monitor.js        ## main file
```


Output
-------

* **/nodeData/new_node_data.json**    : Contains Node status from the current run in JSON format
* **/nodeData/old_node_data.json**    : Contains Node status from the previous run in JSON format
* **/nodeData/result.json**           : Contains Nodes' changed status in JSON format (generated from comparison of new and old node data)

Note
-----
* result.json will not be created the first time you run Node Status Monitor as there will be no old node data to compare.


