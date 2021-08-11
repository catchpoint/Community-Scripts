var config = {
    client_key: 'Rh-CS-jUa7GK9W3q',
    client_secret: 'a7d8ef9b-02be-49bf-8fbf-16d4d1ab2a44',
    files: {
        new_data_file: 'output/new_node_data.json',
        old_data_file: 'output/old_node_data.json',
        result_file: 'output/result.json'
    },
    token_url:'https://iostage.catchpoint.com/ui/api/token',
    nodes_detail_url:'https://iostage.catchpoint.com/ui/api/v1/nodes?targeted=true',
    only_changed_data:true
}
export default config;