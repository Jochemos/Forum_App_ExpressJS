import 'express';
import express, { Response, Request } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import makeRepositories from './middleware/repositories';

declare module 'express' {
  interface Request {
    repositories: any
  }
}

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(makeRepositories(process.env.STORAGE_FILE_PATH));

app.get('/', (_, res) => {

    res.status(200).json({ message: 'Welcome to responder!' });

});

app.get('/questions', async (req: Request, res: Response) => {

    const questions = await req.repositories.questionRepo.getQuestions();
    res.status(200).json(questions);

});

app.get('/questions/:questionId', async (req: Request, res: Response) => {

    const questionById = await req.repositories.questionRepo.getQuestionById(req.params.questionId);

    if(questionById === null){
        res.status(404).json({'message': 'File Not Found'});
    }else{
        res.status(200).json(questionById);
    }

});

app.post('/questions', async (req: Request, res: Response) => {

    const addQuestion = await req.repositories.questionRepo.addQuestion(req.body);
    res.status(201).json(addQuestion);

});

app.get('/questions/:questionId/answers', async (req: Request, res: Response) => {

    const questionById = await req.repositories.questionRepo.getAnswers(req.params.questionId);

    if(questionById === null){
        res.status(404).json({'message': 'File Not Found'});
    }else{
        res.status(200).json(questionById);
    }

});

app.post('/questions/:questionId/answers', async (req: Request, res: Response) => {

    const addAnswer = await req.repositories.questionRepo.addAnswer(req.params.questionId, req.body);
    res.status(201).json(addAnswer);

});

app.get('/questions/:questionId/answers/:answerId', async (req: Request, res: Response) => {

    const getAnswer = await req.repositories.questionRepo.getAnswer(req.params.questionId, req.params.answerId);

    if(getAnswer === null){
        res.status(400).json({'message': 'Bad Request'});
    }else{
        res.status(200).json(getAnswer);
    }

});

app.listen(process.env.PORT, () => {
    console.log(`Responder app listening on port ${process.env.PORT}`);
});

export default app;
