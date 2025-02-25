import { ReasonPhrases, StatusCodes } from "http-status-codes";

export const errorMiddleware = (err, req, res, next) => {
  if (res.headersSent) {
      return next(err); // Agar `res`ga allaqachon javob jo‘natilgan bo‘lsa, xatolikni keyingi middlewarega yuborish
  }
  res.status(err.status || 500).json({
      message: err.message || 'Something went wrong!',
      error: err
  });
};

// export const errorMiddleware = (error, req, res, next) => {
//   try {
//     const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
//     const statusMsg = error.statusMsg || ReasonPhrases.INTERNAL_SERVER_ERROR;
//     const msg =
//       error.msg || `${error.message}` || ReasonPhrases.GATEWAY_TIMEOUT;

//     return res.status(statusCode).json({
//       succes: false,
//       error: {
//         statusCode,
//         statusMsg,
//         msg,
//       },
//     });
//   } catch (error) {
//     return next(error);
//   }
// };