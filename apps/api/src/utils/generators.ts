/**
 * Generate tracking ID
 */
function generateTrackingId(): string {
  const prefix = 'YB';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}${random}`;
}

/**
 * Generate UUID
 */
function generateId(): string {
  return Utilities.getUuid();
}

/**
 * Calculate order total
 */
function calculateOrderTotal(items: OrderItem[]): number {
  let total = 0;
  
  for (let i = 0; i < items.length; i++) {
    total += items[i].subtotal;
  }
  
  return total;
}