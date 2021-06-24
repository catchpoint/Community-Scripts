Node Status Monitor
===================

Architecture
-------------
![image](https://vizlibs.catchpoint.com/icons/node_status_arch.png)

Folder Structure [Before Execution]
-----------------------------------

```
NodeJs/
├── api
| ├── auth.js             ## contains apis related to authentication
├── config
| ├── config.js           ## configuration file
├── logs                  
| ├── info
| ├── error
├── nodeData
├── utils
| ├── logger.js           ## logger utility
├──package.json           ## project dependencies
└── node_monitor.js        ## main file
```

Folder Structure [After Execution]
-----------------------------------

```
NodeJs/
├── api
| ├── auth.js             ## contains apis related to authentication
├── config
| ├── config.js           ## configuration file
├── logs
| ├── info
| |  ├── info.log         ## contains informational logs. file name will be based on date it ran
| ├── error
| |  ├── error.log        ## contains error logs. file name will be based on date it ran
├── nodeData
| ├── new_node_data.json    ## Output file Json Format Data Node's status Current run
| ├── old_node_data.json    ## Output file Json Format Data Node's status Previous run
| ├── result.json         ## Output file Json Format Result with Node's changed Status
├── utils
| ├── logger.js           ## logger utility
├──package.json           ## project dependencies
└── node_monitor.js        ## main file
```

Prerequisites and Configuration
-------------------------------

1. NodeJs - 14.17.0 +  [ [Download NodeJs](https://nodejs.org/en/download/) ]
2. nmp    - 6.14.13 +


Credentials 
-----------

Use Key and Secret mentioned on [Portal](https://portal.catchpoint.com/ui/Content/Administration/ApiDetail.aspx) and assign it to respective mapping under file config.js

Installation
------------

Steps
1. npm install

How To Run?
-----------

1. npm start

or

1. npm install
2. node node_monitor.js

Output
-------

* old_node_data.json    : Contains Node's status of previous run in JSON format
* new_node_data.json    : Contains Node's status of current run in JSON format
* result.json           : Contains Node's changed status ,compared from above two files 

Note
-----
* result.json will not be created for first run as there will be no data to do comparison.


