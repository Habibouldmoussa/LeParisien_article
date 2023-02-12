const multer = require('multer');

describe('File upload functionality', () => {
    it('should only accept jpg, jpeg, png and webp image types', () => {
        const filterImage = multer({ storage: storage, fileFilter: filterImage }).fileFilter;
        const acceptedMimeTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];
        const rejectedMimeTypes = ['application/pdf', 'text/plain'];

        acceptedMimeTypes.forEach(mimeType => {
            const req = {};
            const file = { mimetype: mimeType };
            const callback = jest.fn();
            filterImage(req, file, callback);
            expect(callback).toHaveBeenCalledWith(null, true);
        });

        rejectedMimeTypes.forEach(mimeType => {
            const req = {};
            const file = { mimetype: mimeType };
            const callback = jest.fn();
            filterImage(req, file, callback);
            expect(callback).toHaveBeenCalledWith(null, false);
        });
    });

    it('should store the uploaded file in the "images" directory', () => {
        const storage = multer({ storage: storage, fileFilter: filterImage }).storage;
        const req = {};
        const file = { originalname: 'example.jpg', mimetype: 'image/jpg' };
        const callback = jest.fn();
        storage.destination(req, file, callback);
        expect(callback).toHaveBeenCalledWith(null, 'images');
    });

    it('should save the uploaded file with a unique name', () => {
        const storage = multer({ storage: storage, fileFilter: filterImage }).storage;
        const req = {};
        const file = { originalname: 'example.jpg', mimetype: 'image/jpg' };
        const callback = jest.fn();
        storage.filename(req, file, callback);
        expect(callback).toHaveBeenCalledWith(null, expect.stringMatching(/example\d{13}.jpg/));
    });
});