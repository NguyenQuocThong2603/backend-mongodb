import mongoose from 'mongoose';

const { Schema } = mongoose;

mongoose.connect('mongodb://localhost:27017/TestMongo');

// const BookSchema = new Schema({
//   aaaa: String,
//   author: { type: Schema.Types.ObjectId, ref: 'Author' },
// });

// const Book = mongoose.model('Book', BookSchema);

// const AuthorSchema = new Schema({
//   name: String,
//   age: Number,
//   stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }],
// });

// const Author = mongoose.model('Author', AuthorSchema);

const UserSchema = new Schema({
  name: String,
  departments: Array,
});

const User = mongoose.model('User', UserSchema);

const user1 = new User({
  name: 'Thong',
  departments: ['BE', 'FE', 'SW'],
});

const user2 = new User({
  name: 'Tan',
  departments: ['BE', 'FE'],
});

const user3 = new User({
  name: 'Lao',
  departments: ['BE', 'FE', 'SW'],
});

const user4 = new User({
  name: 'Hieu',
  departments: {
    room: 1,
  },
});

// await User.deleteMany({
//   name: 'Hieu'
// })
const res = await User.aggregate([
  {
    $project: {
      name: 1,
      departmentSize: {$size: "$departments"}
    },
  },
  {
    $match :{
      departmentSize: {$gte: 4}
    }
  }
]);

console.log(res);

// const author1 = new Author({
//   name: 'Thong',
//   age: 21,
// });

// author.save(err => {
//   if (err) console.log(err);
//   const book = new Book({
//     title: 'Toi tai goi ban cung the',
//     author: author._id,
//   });
//   book.save();
//   author.stories.push(book);
//   author.save();
// });

var pipeline = [{ $match: {"imdb.rating": { $gte: 7 },genres: { $nin: [ "Crime", "Horror" ] } ,rated: { $in: ["PG", "G" ] },languages: { $all: [ "English", "Japanese" ] } }},{ $project: { _id: 0,title: 1,rated: 1} }]

db.sightings.aggregate([{$match: {species_common: 'Eastern Bluebird'}},{$group: {_id: 'location.coordinates', number_of_sightings: {$count: {$sum: 1}}}}])