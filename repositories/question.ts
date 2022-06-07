import { readFile, writeFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import NewQuestion from '../dto/newQuestion.model';
import NewAnswer from '../dto/newAnswer.model';

const getQuestionsFile = async (fileName) => {

    const fileContent = await readFile(fileName, { encoding: 'utf-8' });

    const questions = await JSON.parse(fileContent);

    return questions;

};

const getNewData = async (fileName, data) => {

    const newData = await JSON.stringify(data);

    await writeFile(fileName, newData);

};

const detectFinalResult = (ifFindResult) => {

    if(!ifFindResult){
        return null;
    }else{
        return ifFindResult;
    }

};

const makeQuestionRepository = fileName => {

    const getQuestions = async () => {

        return await getQuestionsFile(fileName);

    };

    const getQuestionById = async (questionId: string) => {

        const questions = await getQuestionsFile(fileName);

        const findQuestion = questions.find(user => user.id === questionId);

        return detectFinalResult(findQuestion);

    };

    const addQuestion = async (question: NewQuestion[]) => {

        const questions = await getQuestionsFile(fileName);

        const questionWithId = Object.assign({'id': uuidv4()}, question);

        const questionAll = Object.assign(questionWithId, {'answers': []});
        
        questions.push(questionAll);

        await getNewData(fileName, questions);

        return { 'message': 'New question added' };

    };

    const getAnswers = async (questionId: string) => {

        const questions = await getQuestionsFile(fileName);

        const findComment = questions.find(user => user.id === questionId);

        return findComment.answers;

    };

    const getAnswer = async (questionId: string, answerId: string) => {

        const questions = await getQuestionsFile(fileName);

        const findComment = questions.find(user => user.id === questionId);

        if(!findComment){
            return null;
        }

        const findAnswers = findComment.answers.find(answer => answer.id === answerId);

        return detectFinalResult(findAnswers);

    };

    const addAnswer = async (questionId: string, answer: NewAnswer[]) => {

        const questions = await getQuestionsFile(fileName);

        const findComment = questions.find(user => user.id === questionId);

        const answerWithId = Object.assign({'id': uuidv4()}, answer);

        findComment.answers.push(answerWithId);

        await getNewData(fileName, questions);

        return findComment.answers;

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
