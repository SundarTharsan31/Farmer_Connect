process.env.NODE_ENV = 'test';
beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
});