Node Status Monitor
===================

Architecture
------------
![image](https://vizlibs.catchpoint.com/icons/node_status_arch.png)

Folder Structure [Before Execution]
-----------------------------------

```
Python/
├── app.log                   ## application logs
├── api_helper.py             ## contains apis related to authentication
├── config.cfg                ## configuration file
├── process_data.py           ## code for data transformation
└── node_details.py           ## main file
```

Folder Structure [After Execution]
----------------------------------

```
Python/
├── app.log                   ## application logs
├── api_helper.py             ## contains apis related to authentication
├── config.cfg                ## configuration file
├── new_node_data.json        ## Output file:Json Format Data Node's status Current run
├── old_node_data.json        ## Output file:Json Format Data Node's status Previous run
├── result.json               ## Output file: Json Format Result with Node's changed Status
├── process_data.py           ## code for data transformation
└── node_details.py           ## main file
```
Prerequisites and Configuration
-------------------------------

1. python 3+
2. pip - latest available version

Credentials 
-----------

Use Key and Secret mentioned on [Portal](https://portal.catchpoint.com/ui/Content/Administration/ApiDetail.aspx) and assign it to respective mapping under file config.cfg

Installation
------------

Steps
1. pip install pipreqs
2. pipreqs .
3. pip install -r requirements.txt


How To Run?
-----------

* python node_details.py

Output
-------

* old_node_data.json    : Contains Node's status of previous run in JSON format
* new_node_data.json    : Contains Node's status of current run in JSON format
* result.json           : Contains Node's changed status ,compared from above two files 

Note
-----
* result.json will not be created for first run as there will be no data to do comparison.

