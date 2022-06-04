import { Request, Response, NextFunction } from 'express';
import { makeQuestionRepository } from '../repositories/question';

export default fileName => (req: Request, res: Response, next: NextFunction) => {
    req.repositories = { questionRepo: makeQuestionRepository(fileName) };
    next();
};
