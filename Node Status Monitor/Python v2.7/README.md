Node Status Monitor (Python v2.7)
===================

This document provides instructions for installing and using the Python v2.7 version of Catchpoint's Node Status Monitor. For general information about Node Status Monitor, see the main [README](https://github.com/catchpoint/Community-Scripts/blob/main/Node%20Status%20Monitor/README.md).

Prerequisites
-------------------------------

1. python 2.7+  [Download Python 2.7](https://www.python.org/download/releases/2.7/)
2. pip - latest available version

Installation
------------

Copy this folder `/Python v2.7` and all of its contents to the machine that you want to run the Node Status Monitor.

Run the following commands from the `/Python v2.7` folder:

1. pip install pipreqs
2. pipreqs .
3. pip install -r requirements.txt

Credentials 
-----------

To retrieve data from Catchpoint's REST API, you must first add your Key and Secret to the `/config.js` file.

1. Find your Key and Secret in the [Catchpoint Portal](https://portal.catchpoint.com/ui/Content/Administration/ApiDetail.aspx).
2. Copy your Key and Secret to the respective mappings within `/config.cfg`:

```
8   [auth]
9   client_key=<your key>
10  client_secret=<your secret>
```

LookUp for field change
----------
To find differences in node's Data, you must update lookUp_fields in `/config/config.cfg` file.

```  
Fields available for lookup_fields are:
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
[monitor]
lookUp_fields:['status.name','ip_ranges']
```
*  if lookUp_fields is empty,then default value for lookUp_fields will be 'status.name'.

How To Run
-----------

* python node_monitor.py

How To Run Unit Test Cases
--------------------------

* Python v2.7 folder being working directory
* Run python test_node_monitor.py

File Structure [Before Execution]
-----------------------------------

```
Python v2.7/
├── config
| ├── config.cfg               ## Configuration file      
├── libs
| ├── api.py                   ## Contains APIs related to catchpoint authentication and nodes
| ├── common.py                ## contains function related to read/write of file,compare nodes
├── logs                  
| ├── info                     ## Contains application info logs
| ├── error                    ## Contains application error logs
├── utils
| ├── application_constants.py ## Application constants
| ├── logger.py                ## Logger utility
└── node_monitor.py            ## Main file
```

File Structure [After Execution]
----------------------------------

```
Python v2.7/
├── config
| ├── config.cfg               ## Configuration file      
├── libs
| ├── api.py                   ## Contains APIs related to catchpoint authentication and nodes
| ├── common.py                ## contains function related to read/write of file,compare nodes
├── logs                  
| ├── info                     ## Contains application info logs
| ├── error                    ## Contains application error logs
├── utils
| ├── application_constants.py ## Application constants
| ├── logger.py                ## Logger utility
├── Output
| ├── details
| |  ├── new_node_data.json    ## Output file - contains Node status from the current run in JSON format
| |  ├── old_node_data.json    ## Output file - contains Node status from the previous run in JSON format
| ├── changes_in_status.json   ## Output file - contains Nodes' changed status in JSON format (generated from comparison of new and old node data)
└── node_monitor.py            ## Main file
```

Output
-------

* **`/Output/details/new_node_data.json`**    : Contains Node status from the current run in JSON format
* **`/Output/details/old_node_data.json`**    : Contains Node status from the previous run in JSON format
* **`/Output/changes_in_status.json`**        : Contains Nodes' changed status in JSON format (generated from comparison of new and old node data)

Note
-----
* `/Output/changes_in_status.json` will not be created the first time you run Node Status Monitor as there will be no old node data to compare.
