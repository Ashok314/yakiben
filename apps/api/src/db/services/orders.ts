/**
 * Create order (PUBLIC)
 */
function handleCreateOrder(orderData: any): ApiResponse {
  try {
    // Get user if authenticated
    const user = getCurrentUser(orderData.authToken);

    // Use provided ID/TrackingID or generate new ones
    // This allows clients to generate IDs for local persistence before sync
    const orderId = orderData.id || generateId();
    const trackingId = orderData.trackingId || generateTrackingId();

    const order: Order = {
      id: orderId,
      trackingId: trackingId,
      customer: orderData.customer,
      items: orderData.items,
      total: calculateOrderTotal(orderData.items),
      status: 'pending',
      paymentMethod: orderData.paymentMethod || 'cash',
      paymentStatus: 'pending',
      deliveryTime: orderData.deliveryTime,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Store order with JSON fields
    const orderRecord = {
      id: order.id,
      user_id: user ? user.id : '', // Link to user
      tracking_id: order.trackingId,
      customer_json: {
        customerName: orderData.customer,
        companyAddress: orderData.companyAddress,
        companyContact: orderData.companyContact,
        notes: orderData.notes
      },
      items_json: order.items,
      total: order.total,
      status: order.status,
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus,
      delivery_time: order.deliveryTime || '',
      created_at: order.createdAt,
      updated_at: order.updatedAt
    };

    insertRecord(CONFIG.SHEETS.ORDERS, orderRecord);

    return {
      success: true,
      data: {
        trackingId: order.trackingId,
        orderId: order.id
      }
    };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

/**
 * Get orders (PROTECTED)
 */
function handleGetOrders(filters?: { status?: string; trackingId?: string; authToken?: string }): ApiResponse<Order[]> {
  try {
    const user = requireAuth(filters?.authToken); // Pass authToken

    let orders = getSheetData(CONFIG.SHEETS.ORDERS);

    // Filter by user ID immediately
    orders = orders.filter((o: any) => o.user_id === user.id);

    // Parse JSON fields and flatten customer data
    orders = orders.map((order: any) => {
      const customer = order.customer_json || {};
      return {
        id: order.id,
        trackingId: order.tracking_id,
        // Map fields from customer_json or use top-level fallback
        customerName: customer.customerName || order.customer_json || 'Guest',
        companyAddress: customer.companyAddress || '',
        companyContact: customer.companyContact || '',
        notes: customer.notes || '',
        items: order.items_json,
        total: Number(order.total),
        status: order.status,
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        deliveryTime: order.delivery_time,
        createdAt: order.created_at,
        updatedAt: order.updated_at
      };
    });

    // Apply filters
    if (filters) {
      if (filters.status) {
        orders = orders.filter((o: Order) => o.status === filters.status);
      }

      if (filters.trackingId) {
        orders = orders.filter((o: Order) => o.trackingId === filters.trackingId);
      }
    }

    return { success: true, data: orders };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

/**
 * Update order (PROTECTED - staff/manager only)
 */
function handleUpdateOrder(orderId: string, updates: any): ApiResponse {
  try {
    requireRole(['staff', 'manager', 'driver']);

    updates.updated_at = new Date().toISOString();

    const success = updateRecord(CONFIG.SHEETS.ORDERS, orderId, updates);

    return {
      success,
      data: success ? { message: 'Order updated' } : undefined,
      error: success ? undefined : 'Order not found'
    };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}