const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = (req, res, next) => {
	console.log("in the authentication middleware")
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer")) {
		throw new UnauthenticatedError("Authentication invalid");
	}

	const token = authHeader.split(" ")[1];
	try {
		const payload = jwt.verify(token, process.env.JWT_SCERET);
		req.user = { userId: payload.userID, name: payload.name };
		console.log(req.user)
		next();
	} catch (error) {
		throw new UnauthenticatedError("Authentication ");
	}
};

module.exports = auth;