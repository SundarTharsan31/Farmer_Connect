process.env.NODE_ENV = 'test';

jest.mock('../../config/db');
const db = require('../../config/db');

const adminModule = require('../../modules/adminModule');

describe('Admin Module Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ===============================
    // getAllUsers
    // ===============================
    test('getAllUsers → formats users correctly', async () => {

        db.query.mockResolvedValueOnce({
            rows: [{
                id: 1,
                mobile: '9999999999',
                name: 'Farmer1',
                type: 'farmer',
                status: 'PENDING',
                aadhar_number: '1234',
                aadhar_verified: true,
                trust_score: 20,
                document_url: 'doc.pdf',
                document_type: 'pdf',
                admin_notes: 'note',
                verified_at: null,
                business_name: '',
                tax_id: '',
                business_category: '',
                contact_name: '',
                address: '',
                created_at: new Date()
            }]
        });

        const result = await adminModule.getAllUsers();

        expect(result.length).toBe(1);
        expect(result[0].trustScore).toBe(20);
        expect(result[0].mobile).toBe('9999999999');
    });

    // ===============================
    // getUserVerificationData
    // ===============================
    test('getUserVerificationData → success', async () => {

        db.query.mockResolvedValueOnce({
            rows: [{
                id: 1,
                mobile: '999',
                name: 'Test',
                type: 'farmer',
                status: 'PENDING',
                aadhar_number: '',
                aadhar_verified: false,
                address: '',
                business_name: '',
                tax_id: '',
                business_category: '',
                contact_name: '',
                trust_score: 10,
                document_url: '',
                document_type: '',
                profile_photo_url: '',
                admin_notes: '',
                verified_at: null,
                state: 'TN',
                district: 'Chennai',
                lat: 13,
                lng: 80,
                created_at: new Date()
            }]
        });

        const result = await adminModule.getUserVerificationData(1);

        expect(result.id).toBe(1);
        expect(result.location.state).toBe('TN');
    });

    test('getUserVerificationData → returns null if not found', async () => {
        db.query.mockResolvedValueOnce({ rows: [] });

        const result = await adminModule.getUserVerificationData(999);
        expect(result).toBeNull();
    });

    // ===============================
    // approveUser
    // ===============================
    test('approveUser → success', async () => {

        db.query.mockResolvedValueOnce({
            rows: [{
                id: 1,
                name: 'Farmer',
                type: 'farmer',
                status: 'APPROVED',
                trust_score: 50
            }]
        });

        const result = await adminModule.approveUser(1, 'ok');

        expect(result.status).toBe('APPROVED');
    });

    test('approveUser → returns null if not found', async () => {
        db.query.mockResolvedValueOnce({ rows: [] });

        const result = await adminModule.approveUser(999, '');
        expect(result).toBeNull();
    });

    // ===============================
    // rejectUser
    // ===============================
    test('rejectUser → error if no reason', async () => {

        const result = await adminModule.rejectUser(1, '');
        expect(result.error).toBe('Rejection reason is required');
    });

    test('rejectUser → success', async () => {

        db.query.mockResolvedValueOnce({
            rows: [{
                id: 1,
                name: 'Farmer',
                type: 'farmer',
                status: 'REJECTED',
                trust_score: 10
            }]
        });

        const result = await adminModule.rejectUser(1, 'invalid docs');
        expect(result.status).toBe('REJECTED');
    });

    // ===============================
    // getStats
    // ===============================
    test('getStats → returns parsed stats', async () => {

        db.query
            .mockResolvedValueOnce({
                rows: [{
                    farmers: '5',
                    buyers: '3',
                    pending: '2'
                }]
            })
            .mockResolvedValueOnce({
                rows: [{
                    total: '10',
                    active: '6',
                    sold: '4'
                }]
            })
            .mockResolvedValueOnce({
                rows: [{
                    total: '8',
                    total_revenue: '1500.50'
                }]
            });

        const result = await adminModule.getStats();

        expect(result.farmers).toBe(5);
        expect(result.totalRevenue).toBe(1500.50);
    });

    // ===============================
    // getComplaints
    // ===============================
    test('getComplaints → formats correctly', async () => {

        db.query.mockResolvedValueOnce({
            rows: [{
                id: 1,
                order_id: 10,
                raised_by: 5,
                raiser_name: 'Buyer1',
                raiser_type: 'buyer',
                mobile: '999',
                issue_type: 'delay',
                description: 'Late delivery',
                status: 'OPEN',
                admin_response: '',
                created_at: new Date(),
                total_amount: '200',
                order_status: 'delivered'
            }]
        });

        const result = await adminModule.getComplaints();

        expect(result.length).toBe(1);
        expect(result[0].orderAmount).toBe(200);
    });

    // ===============================
    // resolveComplaint
    // ===============================
    test('resolveComplaint → success', async () => {

        db.query.mockResolvedValueOnce({
            rows: [{
                id: 1,
                status: 'RESOLVED'
            }]
        });

        const result = await adminModule.resolveComplaint(1, 'fixed');

        expect(result.status).toBe('RESOLVED');
    });

    test('resolveComplaint → returns null if not found', async () => {

        db.query.mockResolvedValueOnce({ rows: [] });

        const result = await adminModule.resolveComplaint(999, 'none');
        expect(result).toBeNull();
    });

});