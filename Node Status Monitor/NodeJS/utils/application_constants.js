var constant = {
    // Catchpoint URL to get Authentication token and all node details
    token_url:'https://io.catchpoint.com/ui/api/token',
    nodes_detail_url:'https://io.catchpoint.com/ui/api/v1/nodes',
    // Data folder Path
    output_folder_path:'Output',
    raw_data_folder_path:'details',
    raw_files_path: {
        current_session: 'new_node_data.json',
        previous_session: 'old_node_data.json',
    },
    default_lookup_fields:['status.name']
}
export default constant;