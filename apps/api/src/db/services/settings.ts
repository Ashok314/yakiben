/**
 * Get restaurant info (PUBLIC)
 */
function handleGetRestaurantInfo(): ApiResponse<RestaurantInfo> {
  try {
    const settings = getSheetData(CONFIG.SHEETS.SETTINGS);
    
    // Convert settings array to object
    const settingsObj: any = {};
    
    for (let i = 0; i < settings.length; i++) {
      const key = settings[i].key;
      let value = settings[i].value;
      
      // Parse JSON values
      if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
        try {
          value = JSON.parse(value);
        } catch (e) {
          // Keep as string
        }
      }
      
      settingsObj[key] = value;
    }
    
    // Construct restaurant info
    const restaurantInfo: RestaurantInfo = {
      name: settingsObj.restaurant_name || 'Yakiben',
      address: settingsObj.restaurant_address || {},
      phone: settingsObj.restaurant_phone || '',
      email: settingsObj.restaurant_email || '',
      hours: settingsObj.business_hours || {},
      support: settingsObj.support_info || {}
    };
    
    return { success: true, data: restaurantInfo };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

/**
 * Update settings (PROTECTED - manager only)
 */
function handleUpdateSettings(key: string, value: any, authToken: string): ApiResponse {
  try {
    requireRole(['manager'], authToken); // Validate authToken

    const settings = getSheetData(CONFIG.SHEETS.SETTINGS);
    let found = false;

    // Find and update setting
    for (let i = 0; i < settings.length; i++) {
      if (settings[i].key === key) {
        updateRecord(CONFIG.SHEETS.SETTINGS, settings[i].id, {
          value: typeof value === 'object' ? JSON.stringify(value) : value,
          updated_at: new Date().toISOString()
        });
        found = true;
        break;
      }
    }

    if (!found) {
      // Insert new setting
      insertRecord(CONFIG.SHEETS.SETTINGS, {
        id: generateId(),
        key: key,
        value: typeof value === 'object' ? JSON.stringify(value) : value,
        updated_at: new Date().toISOString()
      });
    }

    return { success: true, data: { message: 'Settings updated' } };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}