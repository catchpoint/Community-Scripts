var config = {
    // Catchpoint API Keys
    client_key: '',
    client_secret: '',
    // Options for lookUp fields
    // NOTE: keys are case-sensitive
    /*
        'id'                    : Node Id
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
    */
    lookUp_fields:['status.name','ip_ranges']// if list is empty,then default field will be 'status.name'.
}
export default config;