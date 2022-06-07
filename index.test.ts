import request from 'supertest';
import app from './index';

describe('POST request test', () => {

    test('should add new question', async () => {
        const res = await request(app)
            .post('/api/v1/questions')
            .send({
                'author': 'Joker',
                'summary': 'But who do not like Batman ?'
            });
        expect(res.statusCode).toEqual(201);
    });

});
