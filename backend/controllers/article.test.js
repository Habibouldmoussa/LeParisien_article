const Article = require('../models/article');
const fs = require('fs');
const { createArticle, getOneArticle, modifyArticle, deleteArticle, getAllArticle } = require('../controllers/article');

// Mocks
const req = {
    body: {
        article: JSON.stringify({ title: 'Test Article', body: 'Test Content', slug: "test-article", image: 'http://localhost:4200/images/default.png', })
    },
    file: {
        filename: 'test-image.jpg'
    },
    protocol: 'http',
    get: jest.fn().mockReturnValue('localhost:3000')
};
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};
const next = jest.fn();

jest.mock('fs');

describe('Article Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createArticle', () => {
        it('should create an article', async () => {
            await createArticle(req, res, next);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: 'article enregistré !' });
        });
    });

    describe('getOneArticle', () => {
        it('should return a single article', async () => {
            const article = { title: 'Test Article', slug: 'Test-Article', body: 'Test Content', image: 'http://localhost:4200/images/default.png', };
            Article.findOne = jest.fn().mockResolvedValue(article);

            await getOneArticle(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(article);
        });

        it('should return an error if article is not found', async () => {
            Article.findOne = jest.fn().mockRejectedValue({ error: 'Article not found' });

            await getOneArticle(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Article not found' });
        });
    });
    describe('modifyArticle', () => {
        let article;
        beforeEach(async () => {
            article = await Article.create({
                title: 'Test Article',
                description: 'This is a test article',
                image: 'http://localhost:4200/images/default.png',
            });
        });

        afterEach(async () => {
            await article.deleteOne({ _id: article._id });
        });

        it('modifies an article', async () => {
            const response = await request(app)
                .put(`/articles/${article._id}`)
                .send({
                    Article: JSON.stringify({
                        title: 'Modified Article',
                        description: 'This is a modified test article',
                    }),
                });

            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('article modifié!');

            const updatedArticle = await Article.findById(article._id);
            expect(updatedArticle.title).toBe('Modified Article');
            expect(updatedArticle.description).toBe('This is a modified test article');
        });
    });

    describe('deleteArticle', () => {
        let article;
        beforeEach(async () => {
            article = await Article.create({
                title: 'Test Article',
                slug: 'Test-Article',
                body: 'This is a test article',
                image: 'http://localhost:4200/images/default.png',
            });
        });

        it('deletes an article', async () => {
            const response = await request(app).delete(`/articles/${article._id}`);

            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('article supprimé !');

            const deletedArticle = await Article.findById(article._id);
            expect(deletedArticle).toBeNull();
        });
    });

    describe('getAllArticle', () => {
        beforeEach(async () => {
            await Article.create({
                title: 'Test Article 1',
                body: 'This is a test article',
                slug: 'Test-Article-1',
                image: 'http://localhost:4200/images/default.png',
            });

            await Article.create({
                title: 'Test Article 2',
                body: 'This is another test article',
                slug: 'Test-Article-2',
                image: 'http://localhost:4200/images/default.png',
            });
        });

        afterEach(async () => {
            await Article.deleteMany({});
        });

        it('gets all articles', async () => {
            const response = await request(app).get('/articles');

            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(2);
        });
    });

});
