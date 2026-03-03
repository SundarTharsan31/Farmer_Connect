const orderController = require('../../controllers/orderController');
const orderModule = require('../../modules/orderModule');

jest.mock('../../modules/orderModule');

function mockResponse() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

describe('Order Controller Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // =============================
    // CREATE ORDER
    // =============================

    test('createOrder → success', async () => {
        orderModule.createOrder.mockResolvedValue({ id: 1 });

        const req = {
            user: { id: 1 },
            body: {
                items: [{ id: 1 }],
                deliveryAddress: 'Chennai',
                paymentMethod: 'COD',
                totalAmount: 100
            }
        };
        const res = mockResponse();

        await orderController.createOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            order: { id: 1 },
            message: 'Order placed successfully'
        });
    });

    test('createOrder → missing items (400)', async () => {
        const req = {
            user: { id: 1 },
            body: { deliveryAddress: 'Chennai' }
        };
        const res = mockResponse();

        await orderController.createOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    test('createOrder → missing address (400)', async () => {
        const req = {
            user: { id: 1 },
            body: { items: [{ id: 1 }] }
        };
        const res = mockResponse();

        await orderController.createOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    test('createOrder → error', async () => {
        orderModule.createOrder.mockRejectedValue(new Error('fail'));

        const req = {
            user: { id: 1 },
            body: {
                items: [{ id: 1 }],
                deliveryAddress: 'Chennai'
            }
        };
        const res = mockResponse();

        await orderController.createOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    // =============================
    // GET MY ORDERS
    // =============================

    test('getMyOrders → success', async () => {
        orderModule.getMyOrders.mockResolvedValue([{ id: 1 }]);

        const req = {
            user: { id: 1, type: 'buyer' }
        };
        const res = mockResponse();

        await orderController.getMyOrders(req, res);

        expect(res.json).toHaveBeenCalledWith({
            orders: [{ id: 1 }]
        });
    });

    test('getMyOrders → error', async () => {
        orderModule.getMyOrders.mockRejectedValue(new Error('fail'));

        const req = {
            user: { id: 1, type: 'buyer' }
        };
        const res = mockResponse();

        await orderController.getMyOrders(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    // =============================
    // GET ORDER BY ID
    // =============================

    test('getOrderById → success', async () => {
        orderModule.getOrderById.mockResolvedValue({ id: 1 });

        const req = { params: { id: 1 } };
        const res = mockResponse();

        await orderController.getOrderById(req, res);

        expect(res.json).toHaveBeenCalledWith({
            order: { id: 1 }
        });
    });

    test('getOrderById → not found', async () => {
        orderModule.getOrderById.mockResolvedValue(null);

        const req = { params: { id: 1 } };
        const res = mockResponse();

        await orderController.getOrderById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('getOrderById → error', async () => {
        orderModule.getOrderById.mockRejectedValue(new Error('fail'));

        const req = { params: { id: 1 } };
        const res = mockResponse();

        await orderController.getOrderById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    // =============================
    // UPDATE ORDER STATUS
    // =============================

    test('updateOrderStatus → missing status (400)', async () => {
        const req = {
            params: { id: 1 },
            body: {}
        };
        const res = mockResponse();

        await orderController.updateOrderStatus(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    test('updateOrderStatus → success', async () => {
        orderModule.updateOrderStatus.mockResolvedValue({ id: 1 });

        const req = {
            params: { id: 1 },
            body: { status: 'shipped' }
        };
        const res = mockResponse();

        await orderController.updateOrderStatus(req, res);

        expect(res.json).toHaveBeenCalledWith({
            order: { id: 1 },
            message: 'Order status updated'
        });
    });

    test('updateOrderStatus → not found', async () => {
        orderModule.updateOrderStatus.mockResolvedValue(null);

        const req = {
            params: { id: 1 },
            body: { status: 'shipped' }
        };
        const res = mockResponse();

        await orderController.updateOrderStatus(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('updateOrderStatus → error', async () => {
        orderModule.updateOrderStatus.mockRejectedValue(new Error('fail'));

        const req = {
            params: { id: 1 },
            body: { status: 'shipped' }
        };
        const res = mockResponse();

        await orderController.updateOrderStatus(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    // =============================
    // CREATE COMPLAINT
    // =============================

    test('createComplaint → missing fields (400)', async () => {
        const req = {
            params: { id: 1 },
            user: { id: 1 },
            body: {}
        };
        const res = mockResponse();

        await orderController.createComplaint(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    test('createComplaint → success', async () => {
        orderModule.createComplaint.mockResolvedValue({ id: 10 });

        const req = {
            params: { id: 1 },
            user: { id: 1 },
            body: {
                issueType: 'Delay',
                description: 'Late delivery'
            }
        };
        const res = mockResponse();

        await orderController.createComplaint(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            complaint: { id: 10 },
            message: 'Complaint raised successfully'
        });
    });

    test('createComplaint → error', async () => {
        orderModule.createComplaint.mockRejectedValue(new Error('fail'));

        const req = {
            params: { id: 1 },
            user: { id: 1 },
            body: {
                issueType: 'Delay',
                description: 'Late delivery'
            }
        };
        const res = mockResponse();

        await orderController.createComplaint(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

});