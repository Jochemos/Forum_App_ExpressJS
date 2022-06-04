import { readFile } from 'fs/promises';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import NewQuestion from '../dto/newQuestion.model';
import NewAnswer from '../dto/newAnswer.model';

const makeQuestionRepository = fileName => {
    const getQuestions = async () => {
        const fileContent = await readFile(fileName, { encoding: 'utf-8' });
        const questions = JSON.parse(fileContent);

        return questions;
    };

    const getQuestionById = async (questionId: string) => {
        const fileContent = await readFile(fileName, { encoding: 'utf-8' });
        const questions = JSON.parse(fileContent);
        const findQuestion = questions.find(user => user.id === questionId);

        if(!findQuestion){
            return null;
        }else{
            return findQuestion;
        }

    };

    const addQuestion = async (question: NewQuestion[]): Promise<any> => {
        const fileContent = await readFile(fileName, { encoding: 'utf-8' });
        const questions = JSON.parse(fileContent);

        const questionWithId = Object.assign({'id': uuidv4()}, question);
        const questionAll = Object.assign(questionWithId, {'answers': []});
        questions.push(questionAll);

        const newData = JSON.stringify(questions);

        fs.writeFile(fileName, newData, err => {
            if(err) throw err;
        });

        return { 'message': 'New comment added' };

    };

    const getAnswers = async (questionId: string) => {
        const fileContent = await readFile(fileName, { encoding: 'utf-8' });
        const questions = JSON.parse(fileContent);
        const findComment = questions.find(user => user.id === questionId);

        if(!findComment){
            return null;
        }else{
            return findComment.answers;
        }
    };

    const getAnswer = async (questionId: string, answerId: string) => {
        const fileContent = await readFile(fileName, { encoding: 'utf-8' });
        const questions = JSON.parse(fileContent);
        const findComment = questions.find(user => user.id === questionId);

        if(!findComment){
            return null;
        }

        const findAnswers = findComment.answers.find(answer => answer.id === answerId);

        if(!findAnswers){
            return null;
        }else{
            return findAnswers;
        }

    };

    const addAnswer = async (questionId: string, answer: NewAnswer[]) => {
        const fileContent = await readFile(fileName, { encoding: 'utf-8' });
        const questions = JSON.parse(fileContent);

        const findComment = questions.find(user => user.id === questionId);

        const answerWithId = Object.assign({'id': uuidv4()}, answer);

        findComment.answers.push(answerWithId);

        const newData = JSON.stringify(questions);

        fs.writeFile(fileName, newData, err => {
            if(err) throw err;
        });

        return findComment;
    };

    return {
        getQuestions,
        getQuestionById,
        addQuestion,
        getAnswers,
        getAnswer,
        addAnswer
    };
};

export { makeQuestionRepository };
