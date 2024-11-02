const { prisma } = require('../prisma/prisma-client');

const FollowController = {
  followUser: async (req, res) => {
    const { followingId } = req.body;
    const userId = req.user.userId;

    if (!followingId) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    if (followingId === userId) {
      return res.status(500).json({ error: 'Нельзя подписаться на самого себя' });
    }

    try {
      const existingFollow = await prisma.follows.findFirst({
        where: { followerId: userId, followingId },
      });

      if (existingFollow) {
        return res.status(400).json({ error: 'Вы уже подписаны на этого пользователя' });
      }

      await prisma.follows.create({
        data: {
          follower: { connect: { id: userId } },
          following: { connect: { id: followingId } },
        },
      });

      res.status(200).json({ message: 'Подписка успешна создана' });
    } catch (error) {
      console.log('Error [FOLLOW_USER]', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  unFollowUser: async (req, res) => {
    const { followingId } = req.body;
    const userId = req.user.userId;

    if (!followingId) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    if (followingId === userId) {
      return res.status(500).json({ error: 'Нельзя отписаться от самого себя' });
    }

    try {
      const existingFollow = await prisma.follows.findFirst({
        where: { followerId: userId, followingId },
      });

      if (!existingFollow) {
        return res.status(400).json({ error: 'Вы не подписаны на этого пользователя' });
      }

      await prisma.follows.delete({
        where: {
          id: existingFollow.id,
        },
      });

      res.status(200).json({ message: 'Подписка успешна удалена' });
    } catch (error) {
      console.log('Error [UNFOLLOW_USER]', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = FollowController;
