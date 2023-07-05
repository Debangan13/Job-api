// const { CustomAPIError } = require('../errors')

const { StatusCodes } = require("http-status-codes");
const { object } = require("joi");
const errorHandlerMiddleware = (err, req, res, next) => {
	let customeError = {
		statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		msg: err.message || "Something went wrong try again later",
	};

	// if (err instanceof CustomAPIError) {
	//   return res.status(err.statusCode).json({ msg: err.message })
	// }

	if (err.name === "ValidationError") {
		customeError.msg = Object.values(err.errors)
			.map((item) => item.message)
			.join(","),
      customeError.statusCode = StatusCodes.BAD_REQUEST;
      
    // customeError.msg = `please provide ${Object.keys(err.errors)}`
	}

	if (err.code && err.code === 11000) {
		customeError.msg = `Dublicate value entered for ${Object.keys(
			err.keyValue
		)} field, please choose another value`,
		customeError.statusCode = StatusCodes.BAD_REQUEST; 
	}

  if(err.name === 'CastError'){
    customeError.msg = `No item found with id: ${err.value}`,
    customeError.statusCode = StatusCodes. NOT_FOUND
  }

	// return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
	return res.status(customeError.statusCode).json({ msg: customeError.msg });
};

module.exports = errorHandlerMiddleware;
