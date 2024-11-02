const { prisma } = require('../prisma/prisma-client');

const LikeController = {
  likePost: async (req, res) => {
    const { postId } = req.body;
    const userId = req.user.userId;

    if (!postId) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    try {
      const existingLike = await prisma.like.findFirst({
        where: {
          AND: [{ userId }, { postId }],
        },
      });

      if (existingLike) {
        return res.status(400).json({ error: 'Вы уже поставили лайк этому посту' });
      }

      const like = await prisma.like.create({
        data: {
          userId,
          postId,
        },
      });

      res.json(like);
    } catch (error) {
      console.log('Error [LIKE_POST]', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  unlikePost: async (req, res) => {
    res.send('unlike post');
  },
};

module.exports = LikeController;
