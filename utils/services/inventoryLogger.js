const config = require('../services.js').config,
Promise = require('bluebird'),
winston = require('winston'),
mongoose = require('mongoose'),
Log = mongoose.model('LogModel'),
Item = mongoose.model('ItemModel'),
User = mongoose.model('UserModel');

let user = {};

exports.setUser = function (currentUser) {
	user = currentUser;
}

exports.logBuy = function (item, quantity) {

	Promise.all([User.findById(user._id, "_id alias name ieee money email").exec(), Item.findById(item).exec()]).then(function(values) {
		let log = new Log({
			action: "buy",
			who: values[0],
			item: values[1],
			quantity: quantity,
			options: {
				cancelled: false
			}
		});

		log.save().then(() => {

		});
	});
}

exports.logCancel = function (purchase) {

	Promise.all([User.findById(user._id, "_id alias name ieee money email")]).then(function(values) {


		let log = new Log({
			action: "cancel",
			who: values[0],
			options: {purchase: purchase}
		});

		log.save().then(() => {

		});
	});
}

exports.logInsert = function (item) {

	Promise.all([User.findById(user._id, "_id alias name ieee money email"), Item.findById(item)]).then(function(values) {
		let log = new Log({
			action: "insert",
			who: values[0],
			item: values[1]
		});

		log.save().then(() => {

		});
	});



}

exports.logUpdate = function (item, reset) {

	Promise.all([User.findById(user._id, "_id alias name ieee money email"), Item.findById(item)]).then(function(values) {
		let log = new Log({
			action: "update",
			who: values[0],
			item: values[1],
			options: {reset: reset}
		});

		log.save().then(() => {

		});
	});



}

exports.logRegister = function (who) {

	Promise.all([User.findById(who, "_id alias name ieee money email")]).then(function(values) {
		let log = new Log({
			action: "register",
			who: values[0]
		});

		log.save().then(() => {

		});
	});



}

exports.logAddMoney = function (toUser, quantity) {
	console.log(user);
	console.log(toUser);
	Promise.all([User.findById(user._id, "_id alias name ieee money email"), User.findById(toUser, "_id alias name ieee money email")]).then(function(values) {
		let log = new Log({
			action: "money",
			who: values[0],
			to: values[1],
			quantity: quantity
		});

		log.save().then(() => {

		});
	});



}

exports.init = function() {
	return new Promise((resolve) => {
		return resolve();
	});
}