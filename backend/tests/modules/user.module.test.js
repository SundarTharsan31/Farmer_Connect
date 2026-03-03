process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'testsecret';

jest.mock('../../config/db');
const db = require('../../config/db');

const userModule = require('../../modules/userModule');

describe('User Module Complete Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // =========================
    // getProfile
    // =========================

    test('getProfile → returns formatted user profile', async () => {

        db.query
            // 1️⃣ user query
            .mockResolvedValueOnce({
                rows: [{
                    id: 1,
                    mobile: '9999999999',
                    name: 'Test User',
                    type: 'farmer',
                    trust_score: 20,
                    profile_photo_url: '',
                    document_url: '',
                    document_type: '',
                    admin_notes: ''
                }]
            })
            // 2️⃣ location query
            .mockResolvedValueOnce({ rows: [] })
            // 3️⃣ preferences query
            .mockResolvedValueOnce({ rows: [] });

        const result = await userModule.getProfile(1);

        expect(result.id).toBe(1);
        expect(result.name).toBe('Test User');
        expect(result.trustScore).toBe(20);
        expect(result.location).toBeDefined();
        expect(result.preferences).toBeDefined();
    });

    test('getProfile → returns null if not found', async () => {
        db.query.mockResolvedValueOnce({ rows: [] });

        const result = await userModule.getProfile(999);
        expect(result).toBeNull();
    });

    // =========================
    // updateProfile
    // =========================

    test('updateProfile → returns updated user', async () => {
        db.query.mockResolvedValue({
            rows: [{ id: 1, name: 'Updated' }]
        });

        const result = await userModule.updateProfile(1, { name: 'Updated' });
        expect(result.name).toBe('Updated');
    });

    test('updateProfile → returns null if not found', async () => {
        db.query.mockResolvedValue({ rows: [] });

        const result = await userModule.updateProfile(1, {});
        expect(result).toBeNull();
    });

    // =========================
    // uploadDocument
    // =========================

    test('uploadDocument → returns updated trust score', async () => {
        db.query.mockResolvedValue({
            rows: [{ id: 1, trust_score: 35 }]
        });

        const result = await userModule.uploadDocument(1, 'url', 'aadhar');
        expect(result.trust_score).toBe(35);
    });

    test('uploadDocument → returns null if user not found', async () => {
        db.query.mockResolvedValue({ rows: [] });

        const result = await userModule.uploadDocument(1, 'url', 'aadhar');
        expect(result).toBeNull();
    });

    // =========================
    // uploadProfilePhoto
    // =========================

    test('uploadProfilePhoto → returns updated user', async () => {
        db.query.mockResolvedValue({
            rows: [{ id: 1, trust_score: 45 }]
        });

        const result = await userModule.uploadProfilePhoto(1, 'photo');
        expect(result.id).toBe(1);
    });

    test('uploadProfilePhoto → returns null if user not found', async () => {
        db.query.mockResolvedValue({ rows: [] });

        const result = await userModule.uploadProfilePhoto(1, 'photo');
        expect(result).toBeNull();
    });

    // =========================
    // updateLocation
    // =========================

    test('updateLocation → first time adds trust', async () => {

        db.query
            // check existing location
            .mockResolvedValueOnce({ rows: [{}] })
            // insert/update location
            .mockResolvedValueOnce({
                rows: [{ state: 'TN', district: 'Chennai' }]
            })
            // trust score update
            .mockResolvedValueOnce({});

        const result = await userModule.updateLocation(1, {
            state: 'TN',
            district: 'Chennai'
        });

        expect(result.state).toBe('TN');
    });

    test('updateLocation → not first time (no trust update)', async () => {

        db.query
            // existing location has state
            .mockResolvedValueOnce({ rows: [{ state: 'TN' }] })
            // insert/update location
            .mockResolvedValueOnce({
                rows: [{ state: 'TN' }]
            });

        const result = await userModule.updateLocation(1, { state: 'TN' });

        expect(result.state).toBe('TN');
    });

    // =========================
    // updatePreferences
    // =========================

    test('updatePreferences → returns updated preferences', async () => {
        db.query.mockResolvedValue({
            rows: [{ crop_interests: ['rice'] }]
        });

        const result = await userModule.updatePreferences(1, {
            cropInterests: ['rice']
        });

        expect(result.crop_interests).toContain('rice');
    });

});