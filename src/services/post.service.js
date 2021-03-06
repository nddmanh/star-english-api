import Post from './../models/Post';
import STATUS_CODE from './../constants/status_code';
import winston from './../helper/logger';

const LOG_MODULE = '[POST-SERVICE]';

const getAllPosts = async (infoPage) => {
  try {
    const pageOptions = {
      page: parseInt(infoPage.page, 10) || 1,
      limit: parseInt(infoPage.limit, 10) || 10
    };
    const skip_posts = (pageOptions.page - 1) * pageOptions.limit;
    let posts = await Post.find()
      .skip(skip_posts)
      .limit(pageOptions.limit)
      .select('id title description content createdAt');

    winston.debug(`${LOG_MODULE} Get #${pageOptions.limit} posts in page: #${pageOptions.page}`);
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
    winston.error(`${LOG_MODULE} ${error}`);
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
    winston.debug(`${LOG_MODULE} Create a new post with title: ${title}`);
    return {
      statusCode: STATUS_CODE.SUCCESS,
      message: 'Create a post successfully!',
      data: newPost
    };
  } catch (error) {
    winston.error(`${LOG_MODULE} ${error}`);
    return {
      statusCode: STATUS_CODE.SERVER_ERROR_INTERNAL,
      message: 'Internal server error'
    };
  }
};

const findOnePost = async (id) => {
  try {
    const post = await Post.findById(id).select('id title description content createdAt');
    winston.debug(`${LOG_MODULE} Get posts with id: #${id}`);
    return {
      statusCode: STATUS_CODE.SUCCESS,
      message: 'Get one post successfully',
      data: post
    };
  } catch (error) {
    winston.error(`${LOG_MODULE} ${error}`);
    return {
      statusCode: STATUS_CODE.SERVER_ERROR_INTERNAL,
      message: 'Internal server error'
    };
  }
};

module.exports = {
  getAllPosts,
  createOnePost,
  findOnePost
};
