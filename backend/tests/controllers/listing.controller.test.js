const listingController = require('../../controllers/listingController');
const listingModule = require('../../modules/listingModule');

jest.mock('../../modules/listingModule');

function mockResponse() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

describe('Listing Controller Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // =============================
    // CREATE LISTING
    // =============================
    test('createListing → success', async () => {
        listingModule.createListing.mockResolvedValue({ id: 1 });

        const req = {
            user: { id: 1 },
            body: { cropName: 'Rice' }
        };
        const res = mockResponse();

        await listingController.createListing(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ listing: { id: 1 } });
    });

    test('createListing → error', async () => {
        listingModule.createListing.mockRejectedValue(new Error('fail'));

        const req = { user: { id: 1 }, body: {} };
        const res = mockResponse();

        await listingController.createListing(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    // =============================
    // GET LISTINGS
    // =============================
    test('getListings → success', async () => {
        listingModule.getListings.mockResolvedValue([{ id: 1 }]);

        const req = { query: { search: 'Rice' } };
        const res = mockResponse();

        await listingController.getListings(req, res);

        expect(res.json).toHaveBeenCalledWith({ listings: [{ id: 1 }] });
    });

    test('getListings → error', async () => {
        listingModule.getListings.mockRejectedValue(new Error('fail'));

        const req = { query: {} };
        const res = mockResponse();

        await listingController.getListings(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    // =============================
    // GET MY LISTINGS
    // =============================
    test('getMyListings → success', async () => {
        listingModule.getMyListings.mockResolvedValue([{ id: 2 }]);

        const req = { user: { id: 1 } };
        const res = mockResponse();

        await listingController.getMyListings(req, res);

        expect(res.json).toHaveBeenCalledWith({ listings: [{ id: 2 }] });
    });

    test('getMyListings → error', async () => {
        listingModule.getMyListings.mockRejectedValue(new Error('fail'));

        const req = { user: { id: 1 } };
        const res = mockResponse();

        await listingController.getMyListings(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    // =============================
    // GET LISTING BY ID
    // =============================
    test('getListingById → success', async () => {
        listingModule.getListingById.mockResolvedValue({ id: 1 });

        const req = { params: { id: 1 } };
        const res = mockResponse();

        await listingController.getListingById(req, res);

        expect(res.json).toHaveBeenCalledWith({ listing: { id: 1 } });
    });

    test('getListingById → not found', async () => {
        listingModule.getListingById.mockResolvedValue(null);

        const req = { params: { id: 1 } };
        const res = mockResponse();

        await listingController.getListingById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('getListingById → error', async () => {
        listingModule.getListingById.mockRejectedValue(new Error('fail'));

        const req = { params: { id: 1 } };
        const res = mockResponse();

        await listingController.getListingById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    // =============================
    // UPDATE LISTING
    // =============================
    test('updateListing → success', async () => {
        listingModule.updateListing.mockResolvedValue({ id: 1 });

        const req = {
            params: { id: 1 },
            user: { id: 1 },
            body: { cropName: 'Wheat' }
        };
        const res = mockResponse();

        await listingController.updateListing(req, res);

        expect(res.json).toHaveBeenCalledWith({ listing: { id: 1 } });
    });

    test('updateListing → not found', async () => {
        listingModule.updateListing.mockResolvedValue(null);

        const req = {
            params: { id: 1 },
            user: { id: 1 },
            body: {}
        };
        const res = mockResponse();

        await listingController.updateListing(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('updateListing → error', async () => {
        listingModule.updateListing.mockRejectedValue(new Error('fail'));

        const req = {
            params: { id: 1 },
            user: { id: 1 },
            body: {}
        };
        const res = mockResponse();

        await listingController.updateListing(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    // =============================
    // UPDATE STATUS
    // =============================
    test('updateStatus → missing status (400)', async () => {
        const req = {
            params: { id: 1 },
            user: { id: 1 },
            body: {}
        };
        const res = mockResponse();

        await listingController.updateStatus(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    test('updateStatus → success', async () => {
        listingModule.updateStatus.mockResolvedValue({ id: 1 });

        const req = {
            params: { id: 1 },
            user: { id: 1 },
            body: { status: 'sold' }
        };
        const res = mockResponse();

        await listingController.updateStatus(req, res);

        expect(res.json).toHaveBeenCalledWith({ listing: { id: 1 } });
    });

    test('updateStatus → not found', async () => {
        listingModule.updateStatus.mockResolvedValue(null);

        const req = {
            params: { id: 1 },
            user: { id: 1 },
            body: { status: 'sold' }
        };
        const res = mockResponse();

        await listingController.updateStatus(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('updateStatus → error', async () => {
        listingModule.updateStatus.mockRejectedValue(new Error('fail'));

        const req = {
            params: { id: 1 },
            user: { id: 1 },
            body: { status: 'sold' }
        };
        const res = mockResponse();

        await listingController.updateStatus(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    // =============================
    // DELETE LISTING
    // =============================
    test('deleteListing → success', async () => {
        listingModule.deleteListing.mockResolvedValue(true);

        const req = {
            params: { id: 1 },
            user: { id: 1 }
        };
        const res = mockResponse();

        await listingController.deleteListing(req, res);

        expect(res.json).toHaveBeenCalledWith({
            message: 'Listing deleted successfully'
        });
    });

    test('deleteListing → not found', async () => {
        listingModule.deleteListing.mockResolvedValue(false);

        const req = {
            params: { id: 1 },
            user: { id: 1 }
        };
        const res = mockResponse();

        await listingController.deleteListing(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('deleteListing → error', async () => {
        listingModule.deleteListing.mockRejectedValue(new Error('fail'));

        const req = {
            params: { id: 1 },
            user: { id: 1 }
        };
        const res = mockResponse();

        await listingController.deleteListing(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

});