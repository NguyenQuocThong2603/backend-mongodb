import mongoose from 'mongoose';

const { Schema } = mongoose;

mongoose.connect('mongodb://localhost:27017/TestMongo');

const BookSchema = new Schema({
  aaaa: String,
  author: { type: Schema.Types.ObjectId, ref: 'Author' },
});

const Book = mongoose.model('Book', BookSchema);

const AuthorSchema = new Schema({
  name: String,
  age: Number,
  stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }],
});

const Author = mongoose.model('Author', AuthorSchema);

const author = new Author({
  name: 'Thong',
  age: 21,
});

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

const book = new Book({
  aaaa: 'Vui ve',
  author: author._id,
});

book.save(err => console.log(err));
