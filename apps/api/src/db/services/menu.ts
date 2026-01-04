/**
 * Format image URL (handles Google Drive links)
 */
function formatImageUrl(url: string): string {
  if (!url) return '/assets/menu/placeholder.jpeg';

  // If it's already a direct web link or relative path, keep it
  if (!url.includes('drive.google.com')) {
    return url;
  }

  // Extract File ID from Google Drive link
  const driveIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (driveIdMatch && driveIdMatch[1]) {
    return `https://drive.google.com/uc?export=view&id=${driveIdMatch[1]}`;
  }

  return url;
}

/**
 * Get menu items (PUBLIC)
 */
function handleGetMenu(filters?: { category?: string }): ApiResponse<MenuItem[]> {
  try {
    const rawItems = getSheetData(CONFIG.SHEETS.MENU);
    const rawCustomizations = getSheetData(CONFIG.SHEETS.CUSTOMIZATIONS);

    // Create a map for quick lookup
    const customizationMap: Record<string, any> = {};
    rawCustomizations.forEach((c: any) => {
      customizationMap[c.id] = {
        id: String(c.id),
        name: String(c.name),
        price: Number(c.price || 0),
        available: c.available === true || c.available === 'TRUE'
      };
    });

    // Filter and map items
    const items = rawItems
      .filter((item: any) => item.available === true || item.available === 'TRUE')
      .map((item: any) => {
        // Parse the list of IDs from customization_ids
        // Support both "item1,item2" string and ["item1", "item2"] array
        let linkedIds: string[] = [];
        const rawIds = item.customization_ids;
        if (Array.isArray(rawIds)) {
          linkedIds = rawIds;
        } else if (typeof rawIds === 'string' && rawIds.trim() !== '') {
          linkedIds = rawIds.split(',').map(s => s.trim());
        }

        const customizations = linkedIds
          .map(id => customizationMap[id])
          .filter(c => c && c.available);

        return {
          ...item,
          customizations,
          price: Number(item.price || 0),
          image: formatImageUrl(item.image_url)
        } as MenuItem;
      });

    // Filter by category if provided
    let filteredItems = items;
    if (filters && filters.category) {
      filteredItems = items.filter((item: any) => item.category === filters.category);
    }

    return { success: true, data: filteredItems };
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
function handleUpdateMenuItem(itemId: string, updates: Record<string, unknown>, authToken: string): ApiResponse {
  try {
    requireRole(['manager'], authToken); // Validate authToken

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