var express = require('express');
var router = express.Router();
var connect = require('./db/database');

var Workout = require('./models/workout');

connect().then(function (db) {
	console.log('connected to database');
});

router.use(function (req, res, next) {
	console.log(req.method, req.url);
	next();
});

// Get all workouts
router.get('/workouts', function (_, res) {
	Workout.find({}, function (err, result) {
		if (err)
			return res.status(500).json({
				message: 'GET all workout failed',
				error,
			});
		return res.status(200).json({
			message: 'GET all workout succeeded',
			workouts: result,
		});
	});
});

// Get one workout
router.get('/workout/:id', function (req, res) {
	Workout.find({ _id: req.params.id }, function (error, result) {
		if (error) {
			return res.status(500).json({
				message: 'an error occurred',
			});
		}
		return res.status(200).json({
			message: 'GET one workout succeeded',
			workout: result,
		});
	});
});

// create a workout
router.post('/workouts', function (req, res) {
	if (!req.body.name) {
		return res.status(400).json({
			message: 'request body is empty',
		});
	}

	Workout.create({ ...req.body }, function (error, result) {
		if (error) {
			return res.status(500).json({
				message: 'workout creation failed',
				error,
			});
		}
		return res.status(201).json({
			message: 'successfully created a new workout',
			workout: result,
		});
	});
});

// search --es
router.get('/workouts/search', function (req, res, next) {
	if (req.query.q) {
		Workout.search(
			{
				query_string: { query: req.query.q },
			},
			function (error, results) {
				if (error) return next(error);
				var data = results.hits.hits.map(function (hit) {
					return hit;
				});

				return res.status(200).json({
					message: 'search completed successfully',
					data,
				});
			}
		);
	}
});

// update route
// delete route

module.exports = router;
