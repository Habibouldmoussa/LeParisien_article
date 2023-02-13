const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const middleware = require('./middleware');

jest.mock('jsonwebtoken');
jest.mock('dotenv');

describe('Middleware', () => {
    it('Should call next if the token is valid', () => {
        const req = {
            headers: {
                authorization: 'Bearer valid-token'
            }
        };
        const res = {};
        const next = jest.fn();

        jwt.verify.mockReturnValue({ login: 'recruteur' });

        middleware(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith('valid-token', process.env.APP_SECRET);
        expect(next).toHaveBeenCalled();
        expect(req.auth).toEqual({ login: 'recruteur' });
    });

    it('Should return a 401 error if the token is invalid', () => {
        const req = {
            headers: {
                authorization: 'Bearer invalid-token'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        jwt.verify.mockImplementation(() => {
            throw new Error('invalid token');
        });

        middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'invalid token' });
        expect(next).not.toHaveBeenCalled();
    });
});