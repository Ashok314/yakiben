/**
 * Health check endpoint (PUBLIC)
 */
function handleHealth(): ApiResponse {
  return {
    success: true,
    data: {
      status: 'ok',
      message: 'Yakiben API is running',
      timestamp: new Date().toISOString(),
      version: '1.1.0'
    }
  };
}

/**
 * Authenticated health check endpoint
 */
function handleAuthenticatedHealth(): ApiResponse {
  const user = getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  return {
    success: true,
    data: {
      status: 'ok',
      message: `Yakiben API is running for user ${user.email}`,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
  };
}