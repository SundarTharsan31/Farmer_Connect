process.env.NODE_ENV = 'test';

jest.mock('../../modules/userModule');
const userModule = require('../../modules/userModule');

const userController = require('../../controllers/userController');

function mockResponse() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

describe('User Controller Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // =============================
    // getProfile
    // =============================
    test('getProfile → success', async () => {
        const req = { user: { id: 1 } };
        const res = mockResponse();

        userModule.getProfile.mockResolvedValue({ id: 1 });

        await userController.getProfile(req, res);

        expect(res.json).toHaveBeenCalledWith({ profile: { id: 1 } });
    });

    test('getProfile → 404 if not found', async () => {
        const req = { user: { id: 1 } };
        const res = mockResponse();

        userModule.getProfile.mockResolvedValue(null);

        await userController.getProfile(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('getProfile → 500 on error', async () => {
        const req = { user: { id: 1 } };
        const res = mockResponse();

        userModule.getProfile.mockRejectedValue(new Error('DB error'));

        await userController.getProfile(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    // =============================
    // updateProfile
    // =============================
    test('updateProfile → success', async () => {
        const req = { user: { id: 1 }, body: { name: 'New' } };
        const res = mockResponse();

        userModule.updateProfile.mockResolvedValue({ id: 1 });

        await userController.updateProfile(req, res);

        expect(res.json).toHaveBeenCalledWith({ message: 'Profile updated successfully' });
    });

    test('updateProfile → 404 if not found', async () => {
        const req = { user: { id: 1 }, body: {} };
        const res = mockResponse();

        userModule.updateProfile.mockResolvedValue(null);

        await userController.updateProfile(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    // =============================
    // uploadDocument
    // =============================
    test('uploadDocument → 400 if no file', async () => {
        const req = { user: { id: 1 }, body: {} };
        const res = mockResponse();

        await userController.uploadDocument(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    test('uploadDocument → success', async () => {
        const req = {
            user: { id: 1 },
            file: { filename: 'doc.jpg' },
            body: {}
        };
        const res = mockResponse();

        userModule.uploadDocument.mockResolvedValue({
            document_url: '/uploads/doc.jpg',
            trust_score: 40
        });

        await userController.uploadDocument(req, res);

        expect(res.json).toHaveBeenCalled();
    });

    test('uploadDocument → 404 if user not found', async () => {
        const req = {
            user: { id: 1 },
            file: { filename: 'doc.jpg' },
            body: {}
        };
        const res = mockResponse();

        userModule.uploadDocument.mockResolvedValue(null);

        await userController.uploadDocument(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    // =============================
    // uploadProfilePhoto
    // =============================
    test('uploadProfilePhoto → 400 if no file', async () => {
        const req = { user: { id: 1 } };
        const res = mockResponse();

        await userController.uploadProfilePhoto(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    test('uploadProfilePhoto → success', async () => {
        const req = {
            user: { id: 1 },
            file: { filename: 'photo.jpg' }
        };
        const res = mockResponse();

        userModule.uploadProfilePhoto.mockResolvedValue({
            profile_photo_url: '/uploads/photo.jpg',
            trust_score: 50
        });

        await userController.uploadProfilePhoto(req, res);

        expect(res.json).toHaveBeenCalled();
    });

    // =============================
    // updateLocation
    // =============================
    test('updateLocation → success', async () => {
        const req = { user: { id: 1 }, body: { state: 'TN' } };
        const res = mockResponse();

        userModule.updateLocation.mockResolvedValue({ state: 'TN' });

        await userController.updateLocation(req, res);

        expect(res.json).toHaveBeenCalledWith({
            message: 'Location updated successfully',
            location: { state: 'TN' }
        });
    });

    test('updateLocation → 500 on error', async () => {
        const req = { user: { id: 1 }, body: {} };
        const res = mockResponse();

        userModule.updateLocation.mockRejectedValue(new Error('fail'));

        await userController.updateLocation(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    // =============================
    // updatePreferences
    // =============================
    test('updatePreferences → success', async () => {
        const req = { user: { id: 1 }, body: { smsAlerts: true } };
        const res = mockResponse();

        userModule.updatePreferences.mockResolvedValue({ smsAlerts: true });

        await userController.updatePreferences(req, res);

        expect(res.json).toHaveBeenCalledWith({
            message: 'Preferences updated successfully',
            preferences: { smsAlerts: true }
        });
    });

    test('updatePreferences → 500 on error', async () => {
        const req = { user: { id: 1 }, body: {} };
        const res = mockResponse();

        userModule.updatePreferences.mockRejectedValue(new Error('fail'));

        await userController.updatePreferences(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

});