Node Status Monitor (NodeJS)
===================

This document provides instructions for installing and using the NodeJS version of Catchpoint's Node Status Monitor. For general information about Node Status Monitor, see the main [README](https://github.com/catchpoint/Community-Scripts/blob/main/Node%20Status%20Monitor/README.md).

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

To retrieve data from Catchpoint's REST API, you must first add your Key and Secret to the `/config/config.js` file.

1. Find your Key and Secret in the [Catchpoint Portal](https://portal.catchpoint.com/ui/Content/Administration/ApiDetail.aspx).
2. Copy your Key and Secret to the respective mappings within `/config/config.cfg`:
  
```  
1  var config = {
2    client_key: '<your key>',
3    client_secret: '<your secret>',  
```

LookUp for field change
----------
To find differences in node's Data, you must update lookUp_fields in `/config/config.js` file.

```  
Fields available for lookup_fields are :
        'name'                  : Node Name
        'status.name'           : Node status 
        'network_type.name'     : Node Network Type
        'ip_ranges'             : Node Ip ranges
        'isp.name'              : Node ISP
        'asn.name'              : ASN Name
        'city.name'             : Node City Name
        'region.name'           : Region Name
        'country.name'          : Country Name
        'continent.name'        : Continent Name
        'coordinates.latitude'  : Node coordinates latitude
        'coordinates.longitude' : Node coordinates longitude
```

sample to check status and ip ranges of node, you must update lookup_fields as follows,
```
lookUp_fields:['status.name','ip_ranges'] 
```
*  if lookUp_fields is empty,then default value for lookUp_fields will be 'status.name'.

How To Run
-----------

1. Run `npm start` in the package directory

or

1. `npm install`
2. `node node_monitor.js`

How to Run Unit Test Cases
--------------------------

1. Run `npm test` in the package directory 


File Structure [Before Execution]
-----------------------------------

```
NodeJs/
├── config
| ├── config.js                ## Configuration file
├── libs
| ├── api.js                   ## Contains APIs related to catchpoint authentication and nodes 
| ├── common.js                ## contains function related to read/write of file,compare nodes
├── logs                  
| ├── info                     ## Contains application info logs
| ├── error                    ## Contains application error logs
├── utils
| ├── application_constants.js ## Application constants
| ├── logger.js                ## Logger utility
├──package.json                ## Project dependencies
└── node_monitor.js            ## Main file
```

File Structure [After Execution]
-----------------------------------

```
NodeJs/
├── config
| ├── config.js                ## Configuration file
├── libs
| ├── api.js                   ## Contains APIs related to catchpoint authentication and nodes
| ├── common.js                ## contains function related to read/write of file,compare nodes
├── logs
| ├── info
| |  ├── info.log              ## Contains informational logs. File name will be based on date of execution
| ├── error
| |  ├── error.log             ## Contains error logs. File name will be based on date of execution
├── Output
| ├── details
| |  ├── new_node_data.json    ## Output file - contains Node status from the current run in JSON format
| |  ├── old_node_data.json    ## Output file - contains Node status from the previous run in JSON format
| ├── changes_in_status.json   ## Output file - contains Nodes' changed status in JSON format (generated from comparison of new and old node data)
├── utils
| ├── application_constants.js ## Application constants
| ├── logger.js                ## logger utility
├──package.json                ## project dependencies
└── node_monitor.js            ## main file
```


Output
-------

* **`/Output/details/new_node_data.json`**    : Contains Node status from the current run in JSON format
* **`/Output/details/old_node_data.json`**    : Contains Node status from the previous run in JSON format
* **`/Output/changes_in_status.json`**        : Contains Nodes' changed status in JSON format (generated from comparison of new and old node data)

Note
-----
* `/Output/changes_in_status.json` will not be created the first time you run Node Status Monitor as there will be no old node data to compare.
