import STATUS_CODE from './../constants/status_code';
import winston from './../helper/logger';

const LOG_MODULE = '[DICTIONARY-CONTROLLER]';
const API_DICTIONARY = 'https://api.dictionaryapi.dev/api/';

const findWord = async (req, res) => {
  try {
    winston.debug(`${LOG_MODULE} Get dictionary find word: ${req.params.word}`);
    return res.redirect(`${API_DICTIONARY}v2/entries/en/${req.params.word}`);
  } catch (error) {
    winston.error(`${LOG_MODULE} ${error}`);
    res.status(STATUS_CODE.SERVER_ERROR_INTERNAL)
      .json({
        statusCode: STATUS_CODE.SERVER_ERROR_INTERNAL,
        message: 'Internal server error'
      });
  }
};

module.exports = {
  findWord
};
