import { writeFile, rm } from 'fs/promises';
import { faker } from '@faker-js/faker';
import { makeQuestionRepository } from './question';

describe('question repository', () => {

    type CorrectJSON = {
      id,
      summary,
      author,
      answers: { 'id', 'summary', 'author' }[]
    }[]

    const TEST_QUESTIONS_FILE_PATH = 'test-questions.json';
    let questionRepo;
    const testQuestions: CorrectJSON = [
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
        expect(await questionRepo.getQuestions()).toHaveLength(0);
    });

    test('should return a list of 2 questions', async () => {
        await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions));
        expect(await questionRepo.getQuestions()).toHaveLength(2);
    });

    test('should return a questions by id', async () => {
        await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions));
        const paramId = '50f9e662-fa0e-4ec7-b53b-7845e8f821c3';
        const firstQuestion = testQuestions[0];
        expect(await questionRepo.getQuestionById(paramId)).toEqual(firstQuestion);
    });

    test('should return null if question not exist', async () => {
        await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions));
        const validParamId = '50f9e662-fa0e-4ec7-b53b-7845e8f821c4';
        expect(await questionRepo.getQuestionById(validParamId)).toBeNull();
    });

    test('should return a message after question added', async () => {
        await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions));

        const req = {
            id: faker.datatype.uuid(),
            author: 'Joker',
            summary: 'But who do not like Batman?'
        };

        const message = {'message': 'New question added'};

        expect(await questionRepo.addQuestion(req)).toEqual(message);

        await rm(TEST_QUESTIONS_FILE_PATH);

    });

    test('should return main question where should before add answer', async () => {

        await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions));

        const paramId = '50f9e662-fa0e-4ec7-b53b-7845e8f821c3';

        const authorId: string = faker.datatype.uuid();

        const req = {
            id: authorId,
            author: 'Ms.Robin',
            summary: 'I like you more'
        };

        const result = await questionRepo.addAnswer(paramId, req);

        const answer = await result.answers[1];

        expect(answer).toEqual(expect.objectContaining({
            id: authorId,
            author: req.author,
            summary: req.summary
        }));

        await rm(TEST_QUESTIONS_FILE_PATH);

    });

    test('should return answer by its id', async () => {

        await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions));

        const questionParamId = '50f9e662-fa0e-4ec7-b53b-7845e8f821c3';

        const answerId = '90f9e562-ja0e-4ec7-c22b-7833e8f821a4';

        expect(await questionRepo.getAnswer(questionParamId, answerId)).toEqual(testQuestions[0].answers[0]);


    });

});
