import Post from './../models/Post';
import STATUS_CODE from './../constants/status_code';
import winston from './../helper/logger';

const getAllPosts = async (infoPage) => {
  try {
    const pageOptions = {
      page: parseInt(infoPage.page, 10) || 1,
      limit: parseInt(infoPage.limit, 10) || 1
    };
    const skip_posts = (pageOptions.page - 1) * pageOptions.limit;
    const posts = await Post.find()
      .skip(skip_posts)
      .limit(pageOptions.limit);

    // winston.info(`Get #${pageOptions.limit} posts in page: #${pageOptions.page}`);
    winston.debug(`Get #${pageOptions.limit} posts in page: #${pageOptions.page}`);
    return {
      statusCode: STATUS_CODE.SUCCESS,
      message: 'Get all post successfully',
      data: {
        page: pageOptions.page,
        limit: pageOptions.limit,
        posts
      }
    };
  } catch (error) {
    winston.error(error);
    return {
      statusCode: STATUS_CODE.SERVER_ERROR_INTERNAL,
      message: 'Internal server error'
    };
  }
};

const createOnePost = async (post) => {
  const { title, description, content } = post;
  try {
    let newPost = new Post({
      title,
      description,
      content
    });
    await newPost.save();
    winston.debug(`Create a new post with title: ${title}`);
    return {
      statusCode: STATUS_CODE.SUCCESS,
      message: 'Create a post successfully!',
      data: newPost
    };
  } catch (error) {
    winston.error(error);
    return {
      statusCode: STATUS_CODE.SERVER_ERROR_INTERNAL,
      message: 'Internal server error'
    };
  }
};

module.exports = {
  getAllPosts,
  createOnePost
};
