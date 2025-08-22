export const environment = {
        production: true,
        appName: 'Boat Manager',
        version: '0.2.0',
        BOAT_TABLE_NAME: 'Boats', // Default table name for boats
        LOG_TABLE_NAME: 'Rib_Logs', // Default table name for logs
        PERSON_TABLE_NAME: 'Boat_Users', // Default table name for persons
        checkout_reasons: [
            "Sailability",
            "Maintenance",
            "Dinghy Racing",
            "Dinghy Cruising",
            "Cruiser Racing",
            "Training",
            "Other"
        ],
    region: 'eu-west-1', // Default AWS region
};
