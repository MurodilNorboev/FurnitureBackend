import { ReasonPhrases, StatusCodes } from "http-status-codes"    

export const errorMiddleware = (error, req, res, next) => {
    try {
        // console.log(JSON.stringify(error));
        
        const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        const statusMsg = error.statusMsg || ReasonPhrases.INTERNAL_SERVER_ERROR;
        const msg = 
        error.msg || `${error.message}` || ReasonPhrases.GATEWAY_TIMEOUT;         ////// `${msg}` bu narsaning nomi template literals(template Strings) dep ataladi! 
        
        return res.status(statusCode).json({
            succes: false,
            error: {
                statusCode,
                statusMsg,
                msg,
            }
        })
    } catch (error) {
      return next(error)   
    }
}