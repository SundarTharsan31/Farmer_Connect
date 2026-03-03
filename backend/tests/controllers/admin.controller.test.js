const adminController = require('../../controllers/adminController');
const adminModule = require('../../modules/adminModule');

jest.mock('../../modules/adminModule');

function mockResponse() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

describe('Admin Controller Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // =========================
    // GET ALL USERS
    // =========================
    test('getAllUsers → success', async () => {
        adminModule.getAllUsers.mockResolvedValue([{ id: 1 }]);

        const req = {};
        const res = mockResponse();

        await adminController.getAllUsers(req, res);

        expect(res.json).toHaveBeenCalledWith({ users: [{ id: 1 }] });
    });

    test('getAllUsers → error', async () => {
        adminModule.getAllUsers.mockRejectedValue(new Error('fail'));

        const req = {};
        const res = mockResponse();

        await adminController.getAllUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    // =========================
    // GET USER VERIFICATION
    // =========================
    test('getUserVerification → success', async () => {
        adminModule.getUserVerificationData.mockResolvedValue({ id: 1 });

        const req = { params: { id: 1 } };
        const res = mockResponse();

        await adminController.getUserVerification(req, res);

        expect(res.json).toHaveBeenCalledWith({ user: { id: 1 } });
    });

    test('getUserVerification → not found', async () => {
        adminModule.getUserVerificationData.mockResolvedValue(null);

        const req = { params: { id: 1 } };
        const res = mockResponse();

        await adminController.getUserVerification(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('getUserVerification → error', async () => {
        adminModule.getUserVerificationData.mockRejectedValue(new Error('fail'));

        const req = { params: { id: 1 } };
        const res = mockResponse();

        await adminController.getUserVerification(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    // =========================
    // APPROVE USER
    // =========================
    test('approveUser → success', async () => {
        adminModule.approveUser.mockResolvedValue({ id: 1 });

        const req = { params: { id: 1 }, body: { notes: 'ok' } };
        const res = mockResponse();

        await adminController.approveUser(req, res);

        expect(res.json).toHaveBeenCalledWith({
            message: 'User approved successfully',
            user: { id: 1 }
        });
    });

    test('approveUser → not found', async () => {
        adminModule.approveUser.mockResolvedValue(null);

        const req = { params: { id: 1 }, body: { notes: 'ok' } };
        const res = mockResponse();

        await adminController.approveUser(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('approveUser → error', async () => {
        adminModule.approveUser.mockRejectedValue(new Error('fail'));

        const req = { params: { id: 1 }, body: { notes: 'ok' } };
        const res = mockResponse();

        await adminController.approveUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    // =========================
    // REJECT USER
    // =========================
    test('rejectUser → missing notes (400)', async () => {
        const req = { params: { id: 1 }, body: {} };
        const res = mockResponse();

        await adminController.rejectUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    test('rejectUser → success', async () => {
        adminModule.rejectUser.mockResolvedValue({ id: 1 });

        const req = { params: { id: 1 }, body: { notes: 'reason' } };
        const res = mockResponse();

        await adminController.rejectUser(req, res);

        expect(res.json).toHaveBeenCalledWith({
            message: 'User rejected',
            user: { id: 1 }
        });
    });

    test('rejectUser → module returns error object', async () => {
        adminModule.rejectUser.mockResolvedValue({ error: 'Invalid' });

        const req = { params: { id: 1 }, body: { notes: 'reason' } };
        const res = mockResponse();

        await adminController.rejectUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    test('rejectUser → not found', async () => {
        adminModule.rejectUser.mockResolvedValue(null);

        const req = { params: { id: 1 }, body: { notes: 'reason' } };
        const res = mockResponse();

        await adminController.rejectUser(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    // =========================
    // GET STATS
    // =========================
    test('getStats → success', async () => {
        adminModule.getStats.mockResolvedValue({ farmers: 10 });

        const req = {};
        const res = mockResponse();

        await adminController.getStats(req, res);

        expect(res.json).toHaveBeenCalledWith({ stats: { farmers: 10 } });
    });

    test('getStats → error', async () => {
        adminModule.getStats.mockRejectedValue(new Error('fail'));

        const req = {};
        const res = mockResponse();

        await adminController.getStats(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    // =========================
    // GET COMPLAINTS
    // =========================
    test('getComplaints → success', async () => {
        adminModule.getComplaints.mockResolvedValue([{ id: 1 }]);

        const req = {};
        const res = mockResponse();

        await adminController.getComplaints(req, res);

        expect(res.json).toHaveBeenCalledWith({ complaints: [{ id: 1 }] });
    });

    test('getComplaints → error', async () => {
        adminModule.getComplaints.mockRejectedValue(new Error('fail'));

        const req = {};
        const res = mockResponse();

        await adminController.getComplaints(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    // =========================
    // RESOLVE COMPLAINT
    // =========================
    test('resolveComplaint → missing adminResponse (400)', async () => {
        const req = { params: { id: 1 }, body: {} };
        const res = mockResponse();

        await adminController.resolveComplaint(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    test('resolveComplaint → success', async () => {
        adminModule.resolveComplaint.mockResolvedValue({ id: 1 });

        const req = {
            params: { id: 1 },
            body: { adminResponse: 'Resolved', status: 'RESOLVED' }
        };
        const res = mockResponse();

        await adminController.resolveComplaint(req, res);

        expect(res.json).toHaveBeenCalledWith({
            message: 'Complaint resolved',
            complaint: { id: 1 }
        });
    });

    test('resolveComplaint → not found', async () => {
        adminModule.resolveComplaint.mockResolvedValue(null);

        const req = {
            params: { id: 1 },
            body: { adminResponse: 'Resolved' }
        };
        const res = mockResponse();

        await adminController.resolveComplaint(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('resolveComplaint → error', async () => {
        adminModule.resolveComplaint.mockRejectedValue(new Error('fail'));

        const req = {
            params: { id: 1 },
            body: { adminResponse: 'Resolved' }
        };
        const res = mockResponse();

        await adminController.resolveComplaint(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

});