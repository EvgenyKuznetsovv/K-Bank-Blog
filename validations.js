import { body } from 'express-validator';

export const registerValidation = [
    body('email', "Неверный формат почты").isEmail(),
    body('password', "Пароль должен содержать минимум 5 символов").isLength({ min: 5 }),
    body('fullName', "Слишком короткое имя").isLength({ min: 3 }),
    body('avatarUrl', "Неверная ссылка на аватарку").optional().isURL(),
]

export const loginValidation = [
	body('email', 'Неверный формат почты').isEmail(),
	body('password', "Пароль должен содержать минимум 5 символов").isLength({ min: 5 }),
]

export const postCreateValidation = [
    body('title', 'Длина заголовка минимум 3 символа (формат: строка)').isLength({ min: 3 }).isString(),
    body('text', 'Длина текста минимум 10 символов (формат: строка)').isLength({ min: 10 }).isString(),
    body('tags', 'Неверный формат заголовка').optional().isString(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
]