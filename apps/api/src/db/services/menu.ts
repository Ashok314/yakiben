/**
 * Get menu items (PUBLIC)
 */
function handleGetMenu(filters?: { category?: string }): ApiResponse<MenuItem[]> {
  try {
    let items = getSheetData(CONFIG.SHEETS.MENU);

    // Filter available items
    items = items.filter((item: any) => item.available === true || item.available === 'TRUE');

    // Parse customizations if stored as JSON
    items = items.map((item: any) => ({
      ...item,
      customizations: item.customizations_json || [],
      price: Number(item.price),
      image: item.image_url || '/assets/menu/placeholder.jpeg'
    }));

    // Filter by category if provided
    if (filters && filters.category) {
      items = items.filter((item: any) => item.category === filters.category);
    }

    return { success: true, data: items };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

/**
 * Get customizations (PUBLIC)
 */
function handleGetCustomizations(): ApiResponse<Customization[]> {
  try {
    const items = getSheetData(CONFIG.SHEETS.CUSTOMIZATIONS);

    return {
      success: true,
      data: items.filter((c: any) => c.available === true || c.available === 'TRUE')
    };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

/**
 * Update menu item (PROTECTED - manager only)
 */
function handleUpdateMenuItem(itemId: string, updates: any): ApiResponse {
  try {
    requireRole(['manager']);

    updates.updated_at = new Date().toISOString();

    const success = updateRecord(CONFIG.SHEETS.MENU, itemId, updates);

    return {
      success,
      data: success ? { message: 'Menu item updated' } : undefined,
      error: success ? undefined : 'Item not found'
    };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}