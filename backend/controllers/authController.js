// Import authentication business logic module
const authModule = require('../modules/authModule');
const db = require('../config/db');

/**
 * POST /api/auth/register
 * Body: { mobile, type, name, pin, aadharNumber, ... }
 */
async function register(req, res) {
    try {
        console.log('📝 Register Request Body:', req.body);

        const {
            mobile, type, pin, aadharNumber, dateOfBirth, address,
            businessName, taxId, businessCategory, contactName
        } = req.body;

        // Use contactName as fallback name (for buyers)
        const name = req.body.name || contactName;

        // Required fields validation
        if (!mobile || !type || !pin) {
            return res.status(400).json({ error: 'Mobile, type, and PIN are required' });
        }

        // Register user in database
        const result = await authModule.registerUser({
            mobile, type, name, pin, aadharNumber, dateOfBirth, address,
            businessName, taxId, businessCategory, contactName
        });

        if (result.error) {
            return res.status(400).json({ error: result.error });
        }

        // Registration successful — no auto-login, user needs admin approval
        res.status(201).json({ user: result.user });

    } catch (err) {
        console.error('register error:', err);
        res.status(500).json({ error: 'Registration failed' });
    }
}

/**
 * POST /api/auth/login
 * Body: { mobile, pin, userType }
 */
async function login(req, res) {
    try {
        const { mobile, pin, userType } = req.body;

        if (!mobile || !pin || !userType) {
            return res.status(400).json({ error: 'Mobile, PIN, and user type are required' });
        }

        const result = await authModule.loginUser(mobile, pin, userType);

        if (result.error) {
            // Distinguish between different error types
            const statusCode = result.status === 'PENDING' ? 403 : 401;
            return res.status(statusCode).json({
                error: result.error,
                status: result.status || null
            });
        }

        // Set JWT cookie
        res.cookie('auth_token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ user: result.user });

    } catch (err) {
        console.error('login error:', err);
        res.status(500).json({ error: 'Login failed' });
    }
}

/**
 * POST /api/auth/forgot-pin
 * Body: { mobile, aadharLast4, newPin, userType }
 */
async function forgotPin(req, res) {
    try {
        const { mobile, aadharLast4, newPin, userType } = req.body;

        if (!mobile || !aadharLast4 || !newPin || !userType) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const result = await authModule.resetPin(mobile, aadharLast4, newPin, userType);

        if (result.error) {
            return res.status(400).json({ error: result.error });
        }

        res.json(result);

    } catch (err) {
        console.error('forgotPin error:', err);
        res.status(500).json({ error: 'PIN reset failed' });
    }
}

/**
 * POST /api/auth/admin-login
 * Body: { username, password }
 */
async function adminLogin(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const result = await authModule.adminLogin(email, password);

        if (result.error) {
            return res.status(401).json({ error: result.error });
        }

        // Set JWT cookie for admin session
        res.cookie('auth_token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({ user: result.user });

    } catch (err) {
        console.error('adminLogin error:', err);
        res.status(500).json({ error: 'Login failed' });
    }
}

/**
 * GET /api/auth/me
 * Return current authenticated user (from JWT middleware)
 */
async function getMe(req, res) {
    try {
        const user = await authModule.getUserById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Also fetch location from user_locations table
        const locResult = await db.query('SELECT * FROM user_locations WHERE user_id = $1', [req.user.id]);
        const location = locResult.rows[0] || {};

        res.json({
            user: {
                ...user,
                location: {
                    state: location.state || '',
                    district: location.district || '',
                    lat: location.lat || null,
                    lng: location.lng || null,
                },
            },
        });

    } catch (err) {
        console.error('getMe error:', err);
        res.status(500).json({ error: 'Failed to get user' });
    }
}

/**
 * POST /api/auth/logout
 * Clear authentication cookie
 */
async function logout(req, res) {
    res.clearCookie('auth_token');
    res.json({ message: 'Logged out successfully' });
}

// Export controller functions
module.exports = {
    register,
    login,
    forgotPin,
    adminLogin,
    getMe,
    logout,
};
