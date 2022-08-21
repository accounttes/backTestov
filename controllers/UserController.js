import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserModel from '../models/User.js';

export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      name: req.body.name,
      gender: req.body.gender,
      birthDate: req.body.birthDate,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      },
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось зарегистрироваться',
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const {page = 1, limit = 3} = req.query;

    const allUsers = await UserModel.find();
    const users = await UserModel.find().limit(limit * 1).skip((page - 1) * limit);

    res.json({max: allUsers.length, length: users.length, currPage: page, users: [ ...users]});
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    if (!isValidPass) {
      return res.status(400).json({
        message: 'Неверный логин или пароль',
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      },
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось авторизоваться',
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Нет доступа',
    });
  }
};

export const updateMe = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newData ={
      name: req.body.name,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    };

    // const user = await doc.save();

    // const token = jwt.sign(
    //   {
    //     _id: user._id,
    //   },
    //   'secret123',
    //   {
    //     expiresIn: '30d',
    //   },
    // );

    // const { passwordHash, ...userData } = user._doc;

    const updatedUser = await UserModel.findOneAndUpdate(newData, req.body, { new: true }).catch(error => {
    return res.status(500).send(error);

    return res.status(200).json({
    message : "Updated user",
    data: updatedUser
  });
  });

   
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось зарегистрироваться',
    });
  }
};

export const update = async (req, res) => {
  const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

  try {
    const userId = req.params.id;

    await UserModel.updateOne(
      {
        name: req.params.name,
      },
      {
       name: req.body.name,
       avatarUrl: req.body.avatarUrl,
       passwordHash: hash,
      },
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить статью',
    });
  }
};