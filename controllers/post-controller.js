const { prisma } = require('../prisma/prisma-client');

const PostController = {
  createPost: async (req, res) => {
    const { content } = req.body;

    const authorId = req.user.userId;

    if (!content) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    try {
      const createdPost = await prisma.post.create({
        data: {
          content,
          authorId,
        },
      });

      res.json(createdPost);
    } catch (error) {
      console.log('Error [CREATE_POST]', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  getAllPosts: async (req, res) => {
    res.send('getAllPosts');
  },
  getPostById: async (req, res) => {
    res.send('getPostById');
  },
  deletePost: async (req, res) => {
    res.send('deletePost');
  },
};

module.exports = PostController;
