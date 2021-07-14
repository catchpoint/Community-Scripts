var config = {
    client_key: '',
    client_secret: '',
    files: {
        new_data_file: 'nodeData/new_node_data.json',
        old_data_file: 'nodeData/old_node_data.json',
        result_file: 'nodeData/result.json'
    },
    token_url:'https://io.catchpoint.com/ui/api/token',
    nodes_detail_url:'https://io.catchpoint.com/ui/api/v1/nodes?targeted=true'
}
export default config;