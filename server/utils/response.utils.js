import { constants } from "../constants.js";

/**
 * Sends a success response
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {Object} [data={}] - Additional data to include in the response
 */
function sendSuccess(res, statusCode, message, data = {}) {
    res.status(statusCode).json({
      success: true,
      message:message,
      data:data,
    });
  }
  
  /**
   * Sends an error response
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   */
  function sendError(res, statusCode, message) {
    res.status(statusCode).json({
      success: false,
      message:message,
    });
  }
  
  /**
   * Sends a 500 Internal Server Error response
   * @param {Object} res - Express response object
   * @param {Error} error - Error object
   */
  function sendServerError(res, error) {
    console.error("Internal Server Error:", error);
    res.status(constants.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
  
  // responseUtils.js
  
  /**
   * Sends an unauthorized response
   * @param {Object} res - Express response object
   */
  function sendUnauthorized(res) {
    res.status(constants.UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized",
    });
  }
  
export {
    sendSuccess,
    sendError,
    sendServerError,
    sendUnauthorized,
  };
  