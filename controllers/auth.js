const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");
const { UnauthenticatedError } = require("../errors");

const register = async (req, res, next) => {
	const user = await User.create({ ...req.body });
	const token = user.createJWT();
	console.log(user)

	res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		throw new BadRequestError("Please provide email and password ");
	}

	const user = await User.findOne({ email });

	if (!user) {
		throw new UnauthenticatedError("invalid Credentials");
	}
	
	const isPassowrdCorrect = await user.comparePassword(password)
	
	if (!isPassowrdCorrect) {
		throw new UnauthenticatedError("password incorrect");
	}

	const token = user.createJWT();
	console.log(req.user)
	console.log(user)
	res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
};

module.exports = {
	register,
	login,
};
