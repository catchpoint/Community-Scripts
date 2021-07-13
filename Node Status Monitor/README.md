Node Status Monitor
===================

Summary
-------------------

Node Status Monitor uses Catchpoint's REST API to check the status of all Synthetic Test Nodes you have targeted in your test configurations. This enables you to easily
stay up to date with any status changes that might impact your monitoring.

Node Status Monitor is a stand-alone program, provided in three different versions based on the scripting language used:

- node.js
- python 2.7
- python (3.x)

Logic
-------------------
Each time the Node Status Monitor runs, it performs the following logical steps:

1. Retrieves and outputs the current status of each Node
2. Compares each Node's current status to its status from the previous run
3. Outputs information related to any changes in Node status

Architecture
------------------

![image](https://vizlibs.catchpoint.com/icons/node_status_arch.png)

Installation and Use
-------------------

This document summarizes the design and functionality of the Node Status Monitor. For detailed installation and usage instructions specific to each language,
see the README for the specific version:

- [node.js README](https://github.com/catchpoint/Community-Scripts/blob/June2021_NodeStatusMonitor/Node%20Status%20Monitor/NodeJS/README.md)
- [python 2.7 README](https://github.com/catchpoint/Community-Scripts/blob/June2021_NodeStatusMonitor/Node%20Status%20Monitor/Python%20v2.7/README.md)
- [python (3.x) README](https://github.com/catchpoint/Community-Scripts/blob/June2021_NodeStatusMonitor/Node%20Status%20Monitor/Python/README.md)
