/**
 * Main API router
 */
function api(action: string, data?: any): ApiResponse {
  try {
    // Check authentication for protected endpoints
    if (requiresAuth(action)) {
      // Pass authToken if available in data
      requireAuth(data?.authToken);
    }

    // Route to appropriate handler
    switch (action) {
      // Public endpoints
      case 'health':
        return handleHealth();

      case 'login':
        return handleLogin(data);

      case 'getMenu':
        return handleGetMenu(data);

      case 'getCustomizations':
        return handleGetCustomizations();

      case 'getRestaurantInfo':
        return handleGetRestaurantInfo();

      // Protected endpoints
      case 'createOrder':
        return handleCreateOrder(data);

      case 'getOrders':
        return handleGetOrders(data);

      case 'updateOrder':
        return handleUpdateOrder(data.orderId, data.updates);

      case 'updateMenuItem':
        return handleUpdateMenuItem(data.itemId, data.updates);

      case 'updateSettings':
        return handleUpdateSettings(data.key, data.value);

      // Authenticated endpoints
      case 'getUsers':
        return handleGetUsers();

      case 'authenticated:health':
        return handleAuthenticatedHealth();

      default:
        return { success: false, error: `Unknown action: ${action}` };
    }
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

function createJsonOutput(data: any): GoogleAppsScript.Content.TextOutput {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e: GoogleAppsScript.Events.DoPost): GoogleAppsScript.Content.TextOutput {
  let result: ApiResponse;

  try {
    // With text/plain, the body is in postData.contents
    const contents = e.postData.contents;
    const requestData = contents ? JSON.parse(contents) : {};

    const action = requestData.action;
    const payloadData = requestData.data || null;

    if (!action) {
      throw new Error("Missing 'action' key in payload.");
    }

    result = api(action, payloadData);

  } catch (error) {
    result = { success: false, error: String(error) };
  }

  return createJsonOutput(result);
}

function doGet(e: GoogleAppsScript.Events.DoGet): GoogleAppsScript.Content.TextOutput {
  const result = handleHealth();
  return createJsonOutput(result);
}