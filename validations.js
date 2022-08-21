import { body } from 'express-validator';

export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 6 символов').isLength({ min: 6 }),
];

export const registerValidation = [
  body('birthDate', 'Дата должна быть в формате ISO8601').isISO8601(),
  body('email', 'Неверная почта').isEmail(),
  body('password', 'Пароль должен быть минимум 6 символов').isLength({ min: 6 }),
  body('gender', 'Пол должен быть числовым значением').isNumeric(),
  body('name', 'Укажите имя').isString(),
  body('avatarUrl', 'Неверная ссылка на аватарку').optional().isString(),
];

export const postCreateValidation = [
  body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
  body('text', 'Введите текст статьи').isLength({ min: 3 }).isString(),
  body('tags', 'Неверный формат тэгов').optional().isString(),
  body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];
