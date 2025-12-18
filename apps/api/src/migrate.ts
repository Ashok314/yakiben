/**
 * Migration script to update Orders sheet headers
 */
function migrateOrdersSchema() {
    const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    const sheet = ss.getSheetByName('Orders');

    if (!sheet) {
        console.log('Orders sheet not found');
        return;
    }

    // New desired headers
    const newHeaders = [
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
    ];

    // Overwrite headers
    sheet.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders]);
    console.log('Updated Orders sheet headers');
    return 'Updated headers';
}
