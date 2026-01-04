/**
 * Initial setup script to create necessary sheets
 * Run this function manually from the Apps Script editor or via clasp run
 */
function setupDatabase() {
    const sheets = [
        {
            name: 'Users',
            headers: ['id', 'name', 'email', 'picture', 'role', 'created_at']
        },
        {
            name: 'Sessions',
            headers: ['token', 'user_id', 'expires_at']
        },
        {
            name: 'Menu',
            headers: ['id', 'name', 'description', 'price', 'category', 'image_url', 'available', 'customization_ids']
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
            headers: ['id', 'name', 'price', 'available']
        }
    ];

    const logs: string[] = [];
    let createdCount = 0;
    let ss: GoogleAppsScript.Spreadsheet.Spreadsheet | null = null;

    // Try getting by ID first (preferred)
    if (CONFIG.SHEET_ID) {
        try {
            ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
            logs.push('Using spreadsheet from CONFIG.SHEET_ID: ' + ss.getId());
        } catch (e) {
            logs.push('Failed to open spreadsheet by CONFIG.SHEET_ID: ' + String(e));
        }
    }

    // Fallback to active spreadsheet (if bound)
    if (!ss) {
        try {
            ss = SpreadsheetApp.getActiveSpreadsheet();
            if (ss) logs.push('Using active spreadsheet: ' + ss.getId());
        } catch (e) {
            // Not a bound script
        }
    }

    if (!ss) {
        logs.push('No existing spreadsheet found. Creating new database spreadsheet...');
        ss = SpreadsheetApp.create('Yakiben Database');
        logs.push('************************************************');
        logs.push('CREATED NEW SPREADSHEET');
        logs.push('ID: ' + ss.getId());
        logs.push('PLEASE COPY THIS ID INTO apps/api/src/config.ts');
        logs.push('************************************************');
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
            // Respect existing columns: check if all required headers exist
            const existingHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
            const missingHeaders = config.headers.filter(h => existingHeaders.indexOf(h) === -1);

            if (missingHeaders.length > 0) {
                const startCol = sheet.getLastColumn() + 1;
                sheet.getRange(1, startCol, 1, missingHeaders.length).setValues([missingHeaders]);
                logs.push(`Updated sheet "${config.name}" with missing headers: ${missingHeaders.join(', ')}`);
            } else {
                logs.push(`Sheet already exists and is up to date: ${config.name}`);
            }
        }
    });

    const msg = `Setup complete. Synced ${sheets.length} sheets. DB_ID: ${spreadsheet.getId()}`;
    logs.push(msg);

    console.log(logs.join('\n'));
    return msg;
}
