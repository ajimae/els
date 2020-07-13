var mongoose = require('mongoose');
var client = require("../clients/elasticClient");
var { getResumetoken, saveResumeTaken } = require('../utils/tokenProvider');

var upsertToken = getResumetoken('SOME_UPSERT_TOKEN_ID');
var deleteToken = getResumetoken('SOME_DELETE_TOKEN_ID');

var WorkoutSchema = new mongoose.Schema(
	{
		name: String,
		type: String,
		duration: Number
	},
	{ timestamps: true }
);

var Workout = mongoose.model('Workout', WorkoutSchema);

// watch for changes (write operation) in this document
Workout.watch([
	{
		$match: {
			operationType: {
				$in: ['insert', 'update', 'replace'],
			},
		},
	},
	{
		$project: {
			documentKey: false,
		},
	}],
	{
		resumeAfter: upsertToken,
		fullDocument: 'updateLookup',
	}
).on('change', function (data) {
		// insert data into es for indexing
		data.fullDocument.id = data.fullDocument._id;
		// data.fullDocument.toObject();
		delete data.fullDocument._id;

		client.index({
			index: 'working',
			body: data.fullDocument,
		})
			.then(function (response) {
				console.log("document upserted successsfully with status code", response.statusCode);
			})
			.catch(function (error) { console.log('error:', error.message, error.meta) });
		// save resume token
		saveResumeTaken(data._id, 'SOME_UPSERT_TOKEN_ID');
		// console.log(new Date(), data);
	})
	.on('error', function (error) {
		console.log(error);
	});

// watch for delete (mutation operation) in this document
Workout.watch([
	{
		$match: {
			operationType: {
				$in: ['delete'],
			},
		},
	}, {
		$project: {
			documentKey: true,
		},
	}],
	{
		resumeAfter: deleteToken
	}).on('change', function (data) {
		// delete data from es
		console.log("Deleting data from elasticsearch with id", data.documentKey._id);
		const response = client.delete({
			id: change.documentKey._id,
			index: 'working',
		});
		console.log("document deleted successsfully with status code", response.statusCode);
		await saveResumeTaken(change._id, "SOME_DELETE_TOKEN_ID");
		// save resume token
		saveResumeTaken(data._id, 'SOME_DELETE_TOKEN_ID').then(function (data) { });
		console.log(new Date(), data);
	}).on('error', function (error) {
		console.log(error);
	});

module.exports = Workout;
