const { prisma } = require('../prisma/prisma-client');
const bcrypt = require('bcryptjs');
const Jdenticon = require('jdenticon');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const UserController = {
  register: async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Все поля обязательны' });
    }

    try {
      const findUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (findUser) {
        return res.status(400).json({ error: 'Пользователь уже существует' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const png = Jdenticon.toPng(name, 200);
      const avatarName = `${name.replace(' ', '')}_${Date.now() + Math.random()}.png`;
      const avatarPath = path.join(__dirname, '../uploads', avatarName);
      fs.writeFileSync(avatarPath, png);

      const createdUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          avatarUrl: `/uploads/${avatarName}`,
        },
      });

      res.json(createdUser);
    } catch (error) {
      console.log('Error [REGISTER_USER]', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Все поля обязательны' });
    }
    try {
      const findUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!findUser) {
        return res.status(400).json({ error: 'Пользователь не найден' });
      }

      const isPasswordValid = await bcrypt.compare(password, findUser.password);

      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Неверный пароль' });
      }

      const token = jwt.sign({ userId: findUser.id }, process.env.SECRET_KEY);

      res.json({ token });
    } catch (error) {
      console.log('Error [LOGIN_USER]', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  getUserById: async (req, res) => {},
  updateUser: async (req, res) => {},
  current: async (req, res) => {
    console.log('current');
    res.send(req.user);
  },
};

module.exports = UserController;
