const db = require('../config/db');

/**
 * Get full user profile including location and preferences
 */
async function getProfile(userId) {
    const userResult = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) return null;

    const user = userResult.rows[0];

    // Get location
    const locResult = await db.query('SELECT * FROM user_locations WHERE user_id = $1', [userId]);
    const location = locResult.rows[0] || {};

    // Get preferences
    const prefResult = await db.query('SELECT * FROM user_preferences WHERE user_id = $1', [userId]);
    const preferences = prefResult.rows[0] || {};

    return {
        id: user.id,
        mobile: user.mobile,
        name: user.name,
        type: user.type,
        status: user.status,
        aadharNumber: user.aadhar_number,
        aadharVerified: user.aadhar_verified,
        dateOfBirth: user.date_of_birth,
        address: user.address,
        trustScore: user.trust_score || 0,
        profilePhotoUrl: user.profile_photo_url || '',
        documentUrl: user.document_url || '',
        documentType: user.document_type || '',
        adminNotes: user.admin_notes || '',
        verifiedAt: user.verified_at,
        location: {
            state: location.state || '',
            district: location.district || '',
            lat: location.lat || null,
            lng: location.lng || null,
        },
        preferences: {
            cropInterests: preferences.crop_interests || [],
            smsAlerts: preferences.sms_alerts !== undefined ? preferences.sms_alerts : true,
            priceAlerts: preferences.price_alerts !== undefined ? preferences.price_alerts : true,
            profilePublic: preferences.profile_public !== undefined ? preferences.profile_public : true,
            showLocation: preferences.show_location !== undefined ? preferences.show_location : true,
            showContact: preferences.show_contact !== undefined ? preferences.show_contact : false,
        },
        createdAt: user.created_at,
    };
}

/**
 * Update user profile (name, address, etc.)
 */
async function updateProfile(userId, data) {
    const { name, address, mobile } = data;

    const result = await db.query(
        `UPDATE users SET 
            name = COALESCE($1, name),
            address = COALESCE($2, address),
            mobile = COALESCE($3, mobile),
            updated_at = NOW()
         WHERE id = $4
         RETURNING *`,
        [name, address, mobile, userId]
    );

    if (result.rows.length === 0) return null;
    return result.rows[0];
}

/**
 * Upload document (Aadhar photo for farmers, GST cert for buyers)
 * Adds 15 trust points for document upload
 */
async function uploadDocument(userId, documentUrl, documentType) {
    const result = await db.query(
        `UPDATE users SET 
            document_url = $2,
            document_type = $3,
            trust_score = LEAST(trust_score + 15, 100),
            updated_at = NOW()
         WHERE id = $1
         RETURNING id, trust_score, document_url, document_type`,
        [userId, documentUrl, documentType]
    );

    if (result.rows.length === 0) return null;
    return result.rows[0];
}

/**
 * Upload profile photo — adds 10 trust points
 */
async function uploadProfilePhoto(userId, photoUrl) {
    const result = await db.query(
        `UPDATE users SET 
            profile_photo_url = $2,
            trust_score = LEAST(trust_score + 10, 100),
            updated_at = NOW()
         WHERE id = $1
         RETURNING id, trust_score, profile_photo_url`,
        [userId, photoUrl]
    );

    if (result.rows.length === 0) return null;
    return result.rows[0];
}

/**
 * Update user location
 */
async function updateLocation(userId, { state, district, lat, lng }) {
    // Add 10 trust points for location (only first time)
    const existing = await db.query('SELECT state FROM user_locations WHERE user_id = $1', [userId]);
    const isFirstLocation = !existing.rows[0]?.state;

    const result = await db.query(
        `INSERT INTO user_locations (user_id, state, district, lat, lng, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         ON CONFLICT (user_id) DO UPDATE SET
            state = COALESCE($2, user_locations.state),
            district = COALESCE($3, user_locations.district),
            lat = COALESCE($4, user_locations.lat),
            lng = COALESCE($5, user_locations.lng),
            updated_at = NOW()
         RETURNING *`,
        [userId, state || '', district || '', lat || null, lng || null]
    );

    // Add location trust points only on first location set
    if (isFirstLocation && (state || lat)) {
        await db.query(
            'UPDATE users SET trust_score = LEAST(trust_score + 10, 100) WHERE id = $1',
            [userId]
        );
    }

    return result.rows[0];
}

/**
 * Update user preferences
 */
async function updatePreferences(userId, { cropInterests, smsAlerts, priceAlerts, profilePublic, showLocation, showContact }) {
    const result = await db.query(
        `INSERT INTO user_preferences (user_id, crop_interests, sms_alerts, price_alerts, profile_public, show_location, show_contact, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
         ON CONFLICT (user_id) DO UPDATE SET
            crop_interests = COALESCE($2, user_preferences.crop_interests),
            sms_alerts = COALESCE($3, user_preferences.sms_alerts),
            price_alerts = COALESCE($4, user_preferences.price_alerts),
            profile_public = COALESCE($5, user_preferences.profile_public),
            show_location = COALESCE($6, user_preferences.show_location),
            show_contact = COALESCE($7, user_preferences.show_contact),
            updated_at = NOW()
         RETURNING *`,
        [userId, cropInterests || [], smsAlerts, priceAlerts, profilePublic, showLocation, showContact]
    );

    return result.rows[0];
}

module.exports = {
    getProfile,
    updateProfile,
    uploadDocument,
    uploadProfilePhoto,
    updateLocation,
    updatePreferences,
};
