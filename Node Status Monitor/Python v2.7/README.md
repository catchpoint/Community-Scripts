Node Status Monitor (Python v2.7)
===================

This document provides instructions for installing and using the Python v2.7 version of Catchpoint's Node Status Monitor. For general information about Node Status Monitor, see the main [README](https://github.com/Schultztw/Community-Scripts/blob/June2021_NodeStatusMonitor/Node%20Status%20Monitor/README.md).

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

How To Run
-----------

* python node_details.py

File Structure [Before Execution]
-----------------------------------

```
Python v2.7/
├── app.log                   ## Contains application logs
├── api_helper.py             ## Contains APIs related to authentication
├── config.cfg                ## Configuration file
├── process_data.py           ## Code for data transformation
└── node_details.py           ## Main file
```

File Structure [After Execution]
----------------------------------

```
Python v2.7/
├── app.log                   ## Contains application logs
├── api_helper.py             ## Contains APIs related to authentication
├── config.cfg                ## Configuration file
├── new_node_data.json        ## Output file - contains Node status from the current run in JSON format
├── old_node_data.json        ## Output file - contains Node status from the previous run in JSON format
├── result.json               ## Output file - contains Nodes' changed status in JSON format (generated from comparison of new and old node data)
├── process_data.py           ## Code for data transformation
└── node_details.py           ## Main file
```

Output
-------

* **`/new_node_data.json`**    : Contains Node status from the current run in JSON format
* **`/old_node_data.json`**    : Contains Node status from the previous run in JSON format
* **`/result.json`**           : Contains Nodes' changed status in JSON format (generated from comparison of new and old node data)

Note
-----
* `/result.json` will not be created the first time you run Node Status Monitor as there will be no old node data to compare.


