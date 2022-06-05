import { writeFile, rm } from 'fs/promises';
import { faker } from '@faker-js/faker';
import request from 'supertest';
import app from '../index';
import { makeQuestionRepository } from '../dist/repositories/question';

describe('question repository', () => {
    const TEST_QUESTIONS_FILE_PATH = 'test-questions.json';
    let questionRepo: makeQuestionRepository;
    const testQuestions:[] = [
        {
            id: '50f9e662-fa0e-4ec7-b53b-7845e8f821c3',
            summary: 'Nobody like me...',
            author: 'Michael Keaton as first Batman',
            answers: [
                {
                    id: '90f9e562-ja0e-4ec7-c22b-7833e8f821a4',
                    summary: 'I like you',
                    author: 'Cat Woman'
                }
            ]
        },
        {
            id: 'ce7bddfb-0544-4b14-92d8-188b03c41ee4',
            summary: '... but me like anybody',
            author: 'Christian Bale as second Batman',
            answers: []
        }
    ];

    beforeAll(async () => {

        await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]));

        questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH);
    });

    afterAll(async () => {
        await rm(TEST_QUESTIONS_FILE_PATH);
    });


    test('should return a list of 0 questions', async () => {
        expect(await questionRepo.getQuestions()).toHaveLength(0) as number;
    });

    test('should return a list of 2 questions', async () => {
        await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions));
        expect(await questionRepo.getQuestions()).toHaveLength(2) as number;
    });

    test('should return a questions by id', async () => {
        await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions));
        const paramId: number = '50f9e662-fa0e-4ec7-b53b-7845e8f821c3';
        const firstQuestion: testQuestions = testQuestions[0];
        expect(await questionRepo.getQuestionById(paramId)).toEqual(firstQuestion) as testQuestions;
    });

    test('should return null if question not exist', async () => {
        await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions));
        const validParamId: number = '50f9e662-fa0e-4ec7-b53b-7845e8f821c4';
        expect(await questionRepo.getQuestionById(validParamId)).toBeNull();
    });

    test('should return a message after question added', async () => {
        await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions));

        const req = {
            id: faker.datatype.uuid() as string,
            author: 'Joker' as string,
            summary: 'But who do not like Batman?' as string
        };

        const message = {'message': 'New question added'};

        expect(await questionRepo.addQuestion(req)).toEqual(message) as message;

        await rm(TEST_QUESTIONS_FILE_PATH);

    });

    test('should return main question where should before add answer', async () => {

        await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]));

        await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions));

        const paramId = '50f9e662-fa0e-4ec7-b53b-7845e8f821c3';

        const authorId: string = faker.datatype.uuid();

        const req = {
            id: authorId as faker,
            author: 'Ms.Robin' as string,
            summary: 'I like you more' as string
        };

        const result: makeQuestionRepository = await questionRepo.addAnswer(paramId, req);

        const answer = await result.answers[1];

        expect(answer).toEqual(expect.objectContaining({
            id: authorId as string,
            author: req.author as string,
            summary: req.summary as string
        }));

        await rm(TEST_QUESTIONS_FILE_PATH);

    });

    test('should return answer by its id', async () => {

        await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]));

        await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions));

        const questionParamId: number = '50f9e662-fa0e-4ec7-b53b-7845e8f821c3';

        const answerId: number = '90f9e562-ja0e-4ec7-c22b-7833e8f821a4';

      expect(await questionRepo.getAnswer(questionParamId, answerId)).toEqual(testQuestions[0].answers[0]) as testQuestions;


    });

});

describe('POST request test', () => {

    test('should add new question', async () => {
        const res = await request(app)
            .post('/questions')
            .send({
                'author': 'Joker',
                'summary': 'But who do not like Batman ?'
            });
        expect(res.statusCode).toEqual(201);
    });

});
