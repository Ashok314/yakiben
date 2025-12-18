/**
 * Get current authenticated user
 */
function getCurrentUser(authToken?: string): User | null {
  // 1. Try legacy/internal Session.getActiveUser()
  const email = Session.getActiveUser().getEmail();
  if (email) {
    const users = getSheetData(CONFIG.SHEETS.USERS);
    const user = users.find(u => u.email === email);
    if (user) return { ...user, isLoggedIn: true };
  }

  // 2. Try Custom Auth Token
  if (!authToken) return null;

  const sessions = getSheetData(CONFIG.SHEETS.SESSIONS);
  const validSession = sessions.find(s =>
    s.token === authToken &&
    new Date(s.expires_at).getTime() > new Date().getTime()
  );

  if (!validSession) return null;

  const users = getSheetData(CONFIG.SHEETS.USERS);
  const user = users.find(u => u.id === validSession.user_id);

  return user ? { ...user, isLoggedIn: true } : null;
}

/**
 * Handle Google Login
 */
function handleLogin(credential: string): ApiResponse {
  try {
    // Validate Google ID Token
    // https://developers.google.com/identity/sign-in/web/backend-auth
    const response = UrlFetchApp.fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
    const payload = JSON.parse(response.getContentText());

    if (payload.error_description) {
      throw new Error(payload.error_description);
    }

    const { email, name, picture, sub: googleId } = payload;

    // Find or Create User
    const users = getSheetData(CONFIG.SHEETS.USERS);
    let user = users.find(u => u.email === email);
    let userId;

    if (!user) {
      // Create new user
      userId = Utilities.getUuid();
      const newUser = {
        id: userId,
        name: name,
        email: email,
        picture: picture,
        created_at: new Date().toISOString()
      };
      insertRecord(CONFIG.SHEETS.USERS, newUser);
      user = newUser;
    } else {
      userId = user.id;
    }

    // Create Session
    const token = Utilities.getUuid();
    // Expires in 30 days
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    insertRecord(CONFIG.SHEETS.SESSIONS, {
      token: token,
      user_id: userId,
      expires_at: expiresAt.toISOString()
    });

    return {
      success: true,
      data: {
        token,
        user: { name: user.name, email: user.email, picture: user.picture }
      }
    };

  } catch (error) {
    return { success: false, error: `Login failed: ${error}` };
  }
}

/**
 * Check if endpoint requires authentication
 */
function requiresAuth(action: string): boolean {
  return CONFIG.PROTECTED_ENDPOINTS.indexOf(action) !== -1;
}

/**
 * Require authentication for protected endpoints
 * Now accepts optional authToken from request payload
 */
function requireAuth(authToken?: string): User {
  const user = getCurrentUser(authToken);

  if (!user) {
    throw new Error('Authentication required');
  }

  return user;
}

/**
 * Check if user has required role
 */
function requireRole(allowedRoles: string[], authToken?: string): User {
  const user = requireAuth(authToken);

  if (allowedRoles.indexOf(user.role) === -1) {
    throw new Error('Insufficient permissions');
  }

  return user;
}