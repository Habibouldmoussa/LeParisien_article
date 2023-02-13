const dotenv = require('dotenv');
dotenv.config();
const LOGIN = process.env.LOGIN;
const PASS = process.env.PASS;
const jwt = require('jsonwebtoken');
const APP_SECRET = process.env.APP_SECRET;
const login = require('./index').login;

describe('Login', () => {
    const req = {
        body: {
            username: LOGIN,
            password: PASS
        }
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnValue({})
    };
    const next = jest.fn();

    it('returns a token when the login and password are correct', async () => {
        await login(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            token: jwt.sign({ login: "recruteur" }, APP_SECRET, { expiresIn: '24h' })
        });
    });

    it('returns a 500 error when the login or password are incorrect', async () => {
        req.body.password = 'incorrect';

        const error = 'Invalid credentials';
        const mockJson = jest.fn().mockImplementationOnce((error) => { throw new Error(error) });
        res.status = jest.fn().mockReturnThis();
        res.json = mockJson;

        await login(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error });
    });
});
