/**
 * Initial setup script to create necessary sheets
 * Run this function manually from the Apps Script editor or via clasp run
 */
function setupDatabase() {
    const sheets = [
        {
            name: 'Users',
            headers: ['id', 'name', 'email', 'picture', 'created_at']
        },
        {
            name: 'Sessions',
            headers: ['token', 'user_id', 'expires_at']
        },
        {
            name: 'Menu',
            headers: ['id', 'name', 'description', 'price', 'category', 'image_url', 'available', 'customizations_json']
        },
        {
            name: 'Orders',
            headers: [
                'id',
                'tracking_id',
                'user_id',
                'customer_json',
                'items_json',
                'total',
                'status',
                'payment_method',
                'payment_status',
                'delivery_time',
                'created_at',
                'updated_at'
            ]
        },
        {
            name: 'Settings',
            headers: ['key', 'value', 'description']
        },
        {
            name: 'Customizations',
            headers: ['id', 'name', 'options_json']
        }
    ];

    let ss: GoogleAppsScript.Spreadsheet.Spreadsheet | null = null;
    try {
        ss = SpreadsheetApp.getActiveSpreadsheet();
    } catch (e) {
        // Likely standalone script
    }

    const logs: string[] = [];
    let createdCount = 0;

    if (!ss) {
        logs.push('Standalone script detected. Creating new database spreadsheet...');
        ss = SpreadsheetApp.create('Yakiben Database');
        logs.push('************************************************');
        logs.push('CREATED NEW SPREADSHEET');
        logs.push('ID: ' + ss.getId());
        logs.push('PLEASE COPY THIS ID INTO apps/api/src/config.ts');
        logs.push('************************************************');
    } else {
        logs.push('Using active spreadsheet: ' + ss.getId());
    }

    // Type guard
    if (!ss) throw new Error("Failed to create or get spreadsheet");
    const spreadsheet = ss; // Safe reference

    sheets.forEach(config => {
        let sheet = spreadsheet.getSheetByName(config.name);
        if (!sheet) {
            sheet = spreadsheet.insertSheet(config.name);
            sheet.getRange(1, 1, 1, config.headers.length).setValues([config.headers]);
            // Freeze header row
            sheet.setFrozenRows(1);
            logs.push(`Created sheet: ${config.name}`);
            createdCount++;
        } else {
            logs.push(`Sheet already exists: ${config.name}`);
        }
    });

    const msg = `Setup complete. Created ${createdCount} new sheets. DB_ID: ${spreadsheet.getId()}`;
    logs.push(msg);
    console.log(logs.join('\n'));
    return msg;
}
