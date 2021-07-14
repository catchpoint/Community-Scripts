# Function to convert the api response to desired formate
def process_node_details(node_details):
    node_objects = []
    if node_details.get('items'):
        for i in range(len(node_details['items'])):
            node_objects.append({"id":node_details['items'][i]['id'],
                                 "node_name": node_details['items'][i]['name'],
                                 "status": node_details['items'][i]['status']['name'],
                                 "network_type": node_details['items'][i]['network_type']['name']})
    return node_objects

