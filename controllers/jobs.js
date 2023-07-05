const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
	console.log(req.user.userID);
	console.log(req.body.createdBy);
	const jobs = await Job.find({ createdBy: req.user.userId });
	res.status(StatusCodes.OK).json({ nojobs: jobs.length, jobs });
};

const getJob = async (req, res) => {
	const {
		user: { userId },
		params: { id: jobId },
	} = req;

	const job = await Job.findOne({ _id: jobId, createdBy: userId });

	if (!job) {
		throw new NotFoundError(`no job with id ${jobId}`);
	}
	res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
	try {
		console.log(req.user.userId);
		req.body.createdBy = req.user.userId;
		console.log(req.body.createdBy);
		const job = await Job.create(req.body);
		res.status(StatusCodes.CREATED).json({ job });
	} catch (error) {
		console.log(error.message);
	}
};

const updateJob = async (req, res) => {
	const {
		body: { company, position },
		user: { userId },
		params: { id: jobId },
	} = req;

	if (company === "" || position === "") {
		throw new BadRequestError("Comapny or position fields cannot be empty");
	}

	const job = await Job.findOneAndUpdate(
		{ _id: jobId, createdBy: userId },
		req.body,
		{
			new: true,
			runvalidators: true,
		}
	);

	if (!job) {
		throw new NotFoundError(`no job with id:${jobId}`);
	}

	res.status(StatusCodes.OK).json({ job });
};

const deleteJobs = async (req, res) => {
    const {
        createdBy: {userId},
        params:{id: jobId}
    } = req
    const job = await Job.findOneAndRemove({ _id: jobId,createdBy:userId });
    if(!job){
        throw new NotFoundError(`no job with id:${jobId}`)
    }

	res.status(StatusCodes.OK).json({ job });
};

module.exports = {
	getAllJobs,
	getJob,
	createJob,
	updateJob,
	deleteJobs,
};
