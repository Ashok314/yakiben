/**
 * Populate Menu sheet with mock data
 * Run via clasp run populateMenu
 */
function populateMenu() {
    const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.SHEETS.MENU);

    if (!sheet) throw new Error('Menu sheet not found');

    // Clear existing content (keep headers)
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
        sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
    }

    // Define Mock Data (based on menu.ts)
    const menuItems = [
        {
            id: '1',
            name: '唐揚げ弁当',
            description: '揚げたての唐揚げ、季節の野菜添え',
            price: 850,
            category: '弁当',
            image_url: '/assets/menu/placeholder.jpeg',
            available: true,
            customizations_json: JSON.stringify([
                { id: '1-1', name: '大盛り', price: 100, available: true },
                { id: '1-2', name: 'ご飯少なめ', price: 0, available: true },
                { id: '1-3', name: '唐揚げ増量', price: 200, available: true }
            ])
        },
        {
            id: '2',
            name: 'サーモン弁当',
            description: '新鮮なサーモン、わさび添え',
            price: 950,
            category: '弁当',
            image_url: '/assets/menu/placeholder.jpeg',
            available: true,
            customizations_json: JSON.stringify([
                { id: '2-1', name: 'わさび抜き', price: 0, available: true },
                { id: '2-2', name: '大盛り', price: 100, available: true }
            ])
        },
        {
            id: '3',
            name: '味噌汁',
            description: 'あっさりとした味噌仕立て',
            price: 150,
            category: 'サイド',
            image_url: '/assets/menu/placeholder.jpeg',
            available: true,
            customizations_json: '[]'
        },
        {
            id: '4',
            name: 'お茶',
            description: '香り高い緑茶',
            price: 100,
            category: 'ドリンク',
            image_url: '/assets/menu/placeholder.jpeg',
            available: true,
            customizations_json: '[]'
        },
        {
            id: '5',
            name: 'カレーライス',
            description: '濃厚なカレールーと特製スパイス',
            price: 800,
            category: 'カレー',
            image_url: '/assets/menu/placeholder.jpeg',
            available: true,
            customizations_json: JSON.stringify([
                { id: '5-1', name: '大盛り', price: 100, available: true },
                { id: '5-2', name: '辛さ増し', price: 50, available: true },
                { id: '5-3', name: '温泉卵トッピング', price: 80, available: true }
            ])
        },
        {
            id: '6',
            name: 'キーマカレー',
            description: 'ひき肉たっぷり、スパイシーな味わい',
            price: 850,
            category: 'カレー',
            image_url: '/assets/menu/placeholder.jpeg',
            available: true,
            customizations_json: JSON.stringify([
                { id: '6-1', name: '大盛り', price: 100, available: true },
                { id: '6-2', name: '辛さ増し', price: 50, available: true }
            ])
        },
        {
            id: '7',
            name: 'もも焼き（2本）',
            description: '塩とタレが選べる定番の焼き鳥',
            price: 300,
            category: '焼き鳥',
            image_url: '/assets/menu/placeholder.jpeg',
            available: true,
            customizations_json: JSON.stringify([
                { id: '7-1', name: 'タレ', price: 0, available: true },
                { id: '7-2', name: '塩', price: 0, available: true }
            ])
        },
        {
            id: '8',
            name: 'つくね（2本）',
            description: '特製つくね、玉子黄身添え',
            price: 350,
            category: '焼き鳥',
            image_url: '/assets/menu/placeholder.jpeg',
            available: true,
            customizations_json: JSON.stringify([
                { id: '8-1', name: 'タレ', price: 0, available: true },
                { id: '8-2', name: '塩', price: 0, available: true },
                { id: '8-3', name: '玉子黄身なし', price: 0, available: true }
            ])
        }
    ];

    const headers = ['id', 'name', 'description', 'price', 'category', 'image_url', 'available', 'customizations_json'];

    const rows = menuItems.map(item => {
        return headers.map(header => item[header as keyof typeof item]);
    });

    sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);

    return `Populated ${rows.length} items.`;
}
