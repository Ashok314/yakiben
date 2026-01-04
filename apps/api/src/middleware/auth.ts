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
function handleLogin(data: { credential?: string }): ApiResponse {
  try {
    if (data.credential) {
      // Google Login
      const response = UrlFetchApp.fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${data.credential}`);
      const payload = JSON.parse(response.getContentText());

      if (payload.error_description) {
        throw new Error(payload.error_description);
      }

      const { email, name, picture } = payload;
      const users = getSheetData(CONFIG.SHEETS.USERS);
      let user = users.find(u => u.email === email);

      if (!user) {
        // Create new user
        const userId = Utilities.getUuid();
        user = {
          id: userId,
          name,
          email,
          picture,
          role: 'customer',
          created_at: new Date().toISOString(),
        };
        insertRecord(CONFIG.SHEETS.USERS, user);
      }

      const token = Utilities.getUuid();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      insertRecord(CONFIG.SHEETS.SESSIONS, {
        token,
        user_id: user.id,
        expires_at: expiresAt.toISOString(),
      });

      return {
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            picture: user.picture,
            role: user.role,
          },
        },
      };
    } else {
      throw new Error('Invalid login request');
    }
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
  if (!authToken) {
    throw new Error(JSON.stringify({
      message: 'Authentication required: Missing authToken',
    }));
  }

  const user = getCurrentUser(authToken);

  if (!user) {
    throw new Error(JSON.stringify({
      message: 'Authentication required: Invalid or expired authToken',
      authToken,
    }));
  }

  return user;
}

/**
 * Check if user has required role
 */
function requireRole(allowedRoles: string[], authToken?: string): User {
  const user = requireAuth(authToken);

  // Fetch the user from the USERS sheet to ensure role validation is based on the database
  const users = getSheetData(CONFIG.SHEETS.USERS);
  const dbUser = users.find(u => u.id === user.id);

  if (!dbUser) {
    throw new Error(JSON.stringify({
      message: 'Access denied: User not found',
      userId: user.id,
      allowedRoles,
    }));
  }

  if (!allowedRoles.includes(dbUser.role)) {
    throw new Error(JSON.stringify({
      message: `Access denied: Role '${dbUser.role}' not permitted`,
      userRole: dbUser.role,
      allowedRoles,
    }));
  }

  return dbUser;
}

/**
 * Get all users (PROTECTED - manager only)
 */
function handleGetUsers(data: { authToken?: string }): ApiResponse {
  try {
    // Ensure only managers can access this endpoint
    requireRole(['manager'], data?.authToken);

    // Fetch users with admin roles from the USERS sheet
    const users = getSheetData(CONFIG.SHEETS.USERS);
    const adminUsers = users.filter(u => ['manager', 'staff', 'driver'].includes(u.role));

    return {
      success: true,
      data: adminUsers.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        picture: u.picture,
      })),
    };
  } catch (error) {
    return {
      success: false,
      error: `Error in handleGetUsers: ${error}`,
    };
  }
}