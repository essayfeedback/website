const mongoose = require("mongoose");
const Essay = require("./essay");

const Schema = mongoose.Schema;

const Rating = new Schema({
  rating: {
    type: Number,
    default: 0
  },
  raterUID: {
    type: String,
    required: true
  }
});

const User = new Schema({
  uid: { type: String, required: true },
  isAdmin: {
    type: Number,
    default: 0
  },
  ratings: {
    type: [Rating],
    default: []
  },
  dateCreated: {
    type: String,
    required: true
  },
  lastModified: {
    type: String,
    default: ""
  }
});

User.methods.getEssaysReviewed = function() {
  return Essay.find({ reviewerUID: this.uid, isReviewComplete: true }).exec();
};

User.methods.getEssaysReviewing = function() {
  return Essay.find({ reviewerUID: this.uid, isReviewComplete: false }).exec();
};

User.methods.getEssaysPosted = function() {
  return Essay.find({ ownerUID: this.uid }).exec();
};

User.methods.getPoints = function() {
  return this.getEssaysReviewed()
    .then(essays => essays.length)
    .then(points => this.ratings.reduce((acc, { rating }) => acc + rating, points))
    .then(points => points + 5);
};

User.methods.getRating = function() {
  const totals = this.ratings.reduce((acc, curr) => acc + curr.rating, 0);
  if (this.ratings.length === 0) return Promise.resolve(0);
  else return Promise.resolve(totals / this.ratings.length);
};

User.methods.addRating = function(rating, raterUID) {
  this.ratings.push({
    rating,
    raterUID
  });
  return this.save();
};

User.statics.getReviewers = function() {
  return Essay.find({ reviewerUID: { $ne: "" } }).then(essays => {
    const reviewerUIDs = new Set(essays.map(({ reviewerUID }) => reviewerUID));
    return User.find({
      uid: {
        $all: [...reviewerUIDs]
      }
    }).exec();
  });
};

User.statics.getUsersCount = function() {
  return User.countDocuments().exec();
};

User.statics.sortByPoints = function(essays) {
  return new Promise(resolve => {
    let ownersUIDs = new Set(essays.map(({ ownerUID }) => ownerUID));
	let ownersMap = {};
	resolve(essays)
    // User.methods.find({ uid: { $all: [...ownersUIDs] } }).then(owners => {
    //   owners.forEach(({ uid, points }) => {
    //     ownersMap[uid] = points;
    //   });
    //   const essaysSorted = essays.sort((a, b) => ownersMap[a.ownerUID] - ownersMap[b.ownerUID]);
    //   resolve(essaysSorted);
    // });
  });
};

module.exports = mongoose.model("User", User);
