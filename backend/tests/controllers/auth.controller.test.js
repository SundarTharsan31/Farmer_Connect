const authController = require('../../controllers/authController');
const authModule = require('../../modules/authModule');
const db = require('../../config/db');

jest.mock('../../modules/authModule');
jest.mock('../../config/db');

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.cookie = jest.fn().mockReturnValue(res);
    res.clearCookie = jest.fn().mockReturnValue(res);
    return res;
};

describe('Auth Controller Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ================= REGISTER =================

    test('register → 400 if required fields missing', async () => {
        const req = { body: {} };
        const res = mockResponse();

        await authController.register(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    test('register → 400 if module returns error', async () => {
        authModule.registerUser.mockResolvedValue({ error: 'User exists' });

        const req = {
            body: { mobile: '999', type: 'farmer', pin: '1234' }
        };
        const res = mockResponse();

        await authController.register(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    test('register → success 201', async () => {
        authModule.registerUser.mockResolvedValue({
            user: { id: 1, mobile: '999' }
        });

        const req = {
            body: { mobile: '999', type: 'farmer', pin: '1234' }
        };
        const res = mockResponse();

        await authController.register(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalled();
    });

    // ================= LOGIN =================

    test('login → 400 if missing fields', async () => {
        const req = { body: {} };
        const res = mockResponse();

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    test('login → 403 if pending user', async () => {
        authModule.loginUser.mockResolvedValue({
            error: 'Pending approval',
            status: 'PENDING'
        });

        const req = {
            body: { mobile: '999', pin: '1234', userType: 'farmer' }
        };
        const res = mockResponse();

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
    });

    test('login → 401 for invalid credentials', async () => {
        authModule.loginUser.mockResolvedValue({
            error: 'Invalid credentials'
        });

        const req = {
            body: { mobile: '999', pin: '1234', userType: 'farmer' }
        };
        const res = mockResponse();

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
    });

    test('login → success sets cookie', async () => {
        authModule.loginUser.mockResolvedValue({
            token: 'abc123',
            user: { id: 1 }
        });

        const req = {
            body: { mobile: '999', pin: '1234', userType: 'farmer' }
        };
        const res = mockResponse();

        await authController.login(req, res);

        expect(res.cookie).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalled();
    });

    // ================= FORGOT PIN =================

    test('forgotPin → 400 if missing fields', async () => {
        const req = { body: {} };
        const res = mockResponse();

        await authController.forgotPin(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    test('forgotPin → success', async () => {
        authModule.resetPin.mockResolvedValue({ message: 'PIN reset' });

        const req = {
            body: {
                mobile: '999',
                aadharLast4: '1234',
                newPin: '4321',
                userType: 'farmer'
            }
        };
        const res = mockResponse();

        await authController.forgotPin(req, res);

        expect(res.json).toHaveBeenCalled();
    });

    // ================= ADMIN LOGIN =================

    test('adminLogin → 400 missing fields', async () => {
        const req = { body: {} };
        const res = mockResponse();

        await authController.adminLogin(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    test('adminLogin → 401 invalid', async () => {
        authModule.adminLogin.mockResolvedValue({ error: 'Invalid' });

        const req = { body: { email: 'a', password: 'b' } };
        const res = mockResponse();

        await authController.adminLogin(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
    });

    // ================= GET ME =================

    test('getMe → 404 if user not found', async () => {
        authModule.getUserById.mockResolvedValue(null);

        const req = { user: { id: 1 } };
        const res = mockResponse();

        await authController.getMe(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('getMe → success with location', async () => {
        authModule.getUserById.mockResolvedValue({ id: 1, name: 'Test' });
        db.query.mockResolvedValue({ rows: [{ state: 'TN', district: 'Chennai' }] });

        const req = { user: { id: 1 } };
        const res = mockResponse();

        await authController.getMe(req, res);

        expect(res.json).toHaveBeenCalled();
    });

    // ================= LOGOUT =================

    test('logout → clears cookie', async () => {
        const req = {};
        const res = mockResponse();

        await authController.logout(req, res);

        expect(res.clearCookie).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalled();
    });

});