import { ReasonPhrases, StatusCodes } from "http-status-codes";


export const errorMiddleware = (error, req, res, next) => {
  try {
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const statusMsg = error.statusMsg || ReasonPhrases.INTERNAL_SERVER_ERROR;
    const msg =
      error.msg || `${error.message}` || ReasonPhrases.GATEWAY_TIMEOUT;

    return res.status(statusCode).json({
      succes: false,
      error: {
        statusCode,
        statusMsg,
        msg,
      },
      msg: "Internal Server Error in Middleware.!",
    });
  } catch (error) {
    return next(error);
  }
};