# Table of Contents

* [1. ORM](#1-orm)
* [2. Driver](#2-driver)
* [4. Type of MongoDB](#4-type-of-mongodb)
* [5. Mongoose](#5-mongoose)
* [6. MongoDB Advanced](#6-mongodb-advanced)

>## 1. ORM

ORM is a programming technique that helps to map data records in the database management system to the type of objects defined in classes.

Put another way, you can see the ORM as the layer that connects object oriented programming (OOP) to relational databases.

The ORM and ORM tools help simplify the interaction between relational databases and different OOP languages.

### 1.1 Advantage of ORM

* It speeds up development time for teams.
* Easy to reuse and maintain.
* Improves security. ORM tools are built to eliminate the possibility of SQL injection attacks.
* A lot of things are done "automatically", regarding data processing.
* You don't need to know too much about that database management system, you can still easily access it through ORM.

### 1.2 Disadvantage of ORM

* With each framework there will be a different ORM library, so that you have to take time to learn it. And since they are libraries it will be very "heavy".
* They are likely not going to perform better when very complex queries are involved.
* ORMs are generally slower than using SQL.

### 1.3 Reason why ORM slower than Raw SQL

ORM needs time to create `Model instances`, create `properties` for the `model` and `transform`the model object into relational data before communicating with the database.

>## 2. Driver

A database driver is a computer program that implements a protocol (ODBC or JDBC) for a database connection. User can work with database through raw sql and the results will map into objects in their code

The driver works like an adaptor which connects a generic interface to a specific database vendor implementation.

### 2.1 Advantage of Driver

* High performance
* Take up minimal space

### 2.2 Disadvantage of Driver

* May require expertiese with queries and databases
* Schemas are not clearly defined or have no effect on the database

### 2.3 Difference between ORM and Driver

| ORM | Driver |
| ----|--------|
|Low performance | High performance|
|SQL queries requierment is quite less | SQL queries requirement is high |
|There are not many retrictions while dealing with data| A lot of retrictions |
|Secure | SQL Injection|
| Appropriate with small project | Appropriate with complex project |

>## 4. Type of MongoDB

MongoDB is a `NoSQL document database`. This mean MongoDB store data as documents. Documents are stored in collections.

### 4.1 Difference between NOSQL and SQL

|NoSQL| SQL|
|-----|-----|
|A NoSQL database has dynamic schema for unstructured data| SQL requires you to use predefined schemas to determine the structure of your data before you work with it.|
| NoSQL databases are horizontally scalable. This means that you handle more traffic by sharding, or adding more servers in your NoSQL database | In almost all situations SQL databases are vertically scalable. This means that you can increase the load on a single server by increasing things like RAM, CPU or SSD.|
| These databases are best suited for hierarchical data storage.| These databases are not suited for hierarchical data storage.|
| Follows CAP(consistency, availability, partition tolerance) |Follows ACID property|

### 4.2 CAP Property

* `Consistency`
* `Availability`
* `Partition tolerance`

### 4.3 ACID Property

* `Atomicity`
* `Consistency`
* `Isolation`
* `Durability`

>## 5. Mongoose

### 5.1 Schemas

Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.

Schemas not only define the structure of your document and casting of properties, they also define document instance methods, static Model methods, compound indexes, and document lifecycle hooks called middleware.

#### **Creating model**

By default, Mongoose adds an `_id` property to your schemas.

When you create a new document with the automatically added `_id` property, Mongoose creates a new `_id` of type ObjectId to your document.

```js
const Model = mongoose.model('Test', schema);

const doc = new Model();
doc._id instanceof mongoose.Types.ObjectId; // true
```

You can also overwrite Mongoose's default `_id` with your `own _id`. Just be careful: Mongoose will refuse to save a document that doesn't have an `_id`, so you're responsible for setting `_id` if you define your `own _id` path.

```js
const schema = new Schema({ _id: Number });
const Model = mongoose.model('Test', schema);

const doc = new Model();
await doc.save(); // Throws "document must have an _id before saving"

doc._id = 1;
await doc.save(); // works
```

#### **Instance methods**

Instances of Models are documents. Documents have many of their own built-in instance methods. We may also define our own custom document instance methods.

```js
// define a schema
const animalSchema = new Schema({ name: String, type: String },
{
  // Assign a function to the "methods" object of our animalSchema through schema options.
  // By following this approach, there is no need to create a separate TS type to define the type of the instance functions.
  methods: {
    findSimilarTypes(cb) {
      return mongoose.model('Animal').find({ type: this.type }, cb);
    }
  }
});

// Or, assign a function to the "methods" object of our animalSchema
animalSchema.methods.findSimilarTypes = function(cb) {
  return mongoose.model('Animal').find({ type: this.type }, cb);
};
```

Now all of our `animal` instances have a findSimilarTypes method available to them.

```js
const Animal = mongoose.model('Animal', animalSchema);
const dog = new Animal({ type: 'dog' });

dog.findSimilarTypes((err, dogs) => {
  console.log(dogs); // woof
});
```

* Overwriting a default mongoose document method may lead to unpredictable results.
* Do not declare methods using ES6 arrow functions (=>). Arrow functions explicitly prevent binding `this`, so your method will not have access to the document and the above examples will not work.

#### **Statics**

You can also add static functions to your model. There are three equivalent ways to add a static:

* Add a function property to the second argument of the schema-constructor (`statics`)
* Add a function property to schema.statics
* Call the `Schema#static()` function

```js
// define a schema
const animalSchema = new Schema({ name: String, type: String },
{
  // Assign a function to the "statics" object of our animalSchema through schema options.
  // By following this approach, there is no need to create a separate TS type to define the type of the statics functions. 
  statics: {
    findByName(name) {
      return this.find({ name: new RegExp(name, 'i') });
    }
  }
});

// Or, Assign a function to the "statics" object of our animalSchema
animalSchema.statics.findByName = function(name) {
  return this.find({ name: new RegExp(name, 'i') });
};
// Or, equivalently, you can call `animalSchema.static()`.
animalSchema.static('findByBreed', function(breed) { return this.find({ breed }); });

const Animal = mongoose.model('Animal', animalSchema);
let animals = await Animal.findByName('fido');
animals = animals.concat(await Animal.findByBreed('Poodle'));
```

#### **Indexes**

MongoDB supports secondary indexes. With mongoose, we define these indexes within our `Schema` at the path level or the `schema` level. Defining indexes at the schema level is necessary when creating compound indexes.

```js
const animalSchema = new Schema({
  name: String,
  type: String,
  tags: { type: [String], index: true } // path level
});

animalSchema.index({ name: 1, type: -1 }); // schema level
```

When your application starts up, Mongoose automatically calls `createIndex` for each defined index in your schema. Mongoose will call `createIndex` for each index sequentially, and emit an 'index' event on the model when all the `createIndex` calls succeeded or when there was an error. While nice for development, it is recommended this behavior be disabled in production since index creation can cause a significant performance impact. Disable the behavior by setting the `autoIndex` option of your schema to `false`, or globally on the connection by setting the option `autoIndex` to `false`.

```js
mongoose.connect('mongodb://user:pass@localhost:port/database', { autoIndex: false });
// or
mongoose.createConnection('mongodb://user:pass@localhost:port/database', { autoIndex: false });
// or
mongoose.set('autoIndex', false);
// or
animalSchema.set('autoIndex', false);
// or
new Schema({..}, { autoIndex: false });
```

Mongoose will emit an `index` event on the model when indexes are done building or an error occurred.

```js
// Will cause an error because mongodb has an _id index by default that
// is not sparse
animalSchema.index({ _id: 1 }, { sparse: true });
const Animal = mongoose.model('Animal', animalSchema);

Animal.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error.message);
});
```

#### **Virtuals**

Virtuals are document properties that you can get and set but that do not get persisted to MongoDB. The getters are useful for formatting or combining fields, while setters are useful for de-composing a single value into multiple values for storage.

```js
// define a schema
const personSchema = new Schema({
  name: {
    first: String,
    last: String
  }
});

// compile our model
const Person = mongoose.model('Person', personSchema);

// create a document
const axl = new Person({
  name: { first: 'Axl', last: 'Rose' }
});
```

A virtual property getter lets you define a `fullName` property that won't get persisted to MongoDB.

```js
// That can be done either by adding it to schema options:
const personSchema = new Schema({
  name: {
    first: String,
    last: String
  }
}, {
  virtuals: {
    fullName: {
      get() {
        return this.name.first + ' ' + this.name.last;
      }
    }
  }
});
```

Now, mongoose will call your getter function every time you access the fullName property:

```js
console.log(axl.fullName); // Axl Rose
```

If you use `toJSON()` or `toObject()` mongoose will ***not*** include virtuals by default. This includes the output of calling `JSON.stringify()` on a Mongoose document, because `JSON.stringify()` calls `toJSON()`. Pass `{ virtuals: true }` to either `toObject()` or `toJSON()`

You can also add a custom setter to your virtual that will let you set both first name and last name via the `fullName` virtual.

```js
// Again that can be done either by adding it to schema options:
const personSchema = new Schema({
  name: {
    first: String,
    last: String
  }
}, {
  virtuals: {
    fullName: {
      get() {
        return this.name.first + ' ' + this.name.last;
      }
      set(v) {
        this.name.first = v.substr(0, v.indexOf(' '));
        this.name.last = v.substr(v.indexOf(' ') + 1);
      }
    }
  }
});
axl.fullName = 'William Rose'; // Now `axl.name.first` is "William"
```

Virtual property setters are applied before other validation. So the example above would still work even if the `first` and `last` name fields were required.

Only non-virtual properties work as part of queries and for field selection. Since virtuals are not stored in MongoDB, you can't query with them

#### **Aliases**

Aliases are a particular type of virtual where the getter and setter seamlessly get and set another property. This is handy for saving network bandwidth, so you can convert a short property name stored in the database into a longer name for code readability.

```js
const personSchema = new Schema({
  n: {
    type: String,
    // Now accessing `name` will get you the value of `n`, and setting `name` will set the value of `n`
    alias: 'name'
  }
});

// Setting `name` will propagate to `n`
const person = new Person({ name: 'Val' });
console.log(person); // { n: 'Val' }
console.log(person.toObject({ virtuals: true })); // { n: 'Val', name: 'Val' }
console.log(person.name); // "Val"

person.name = 'Not Val';
console.log(person); // { n: 'Not Val' }
```

You can also declare aliases on nested paths. It is easier to use nested schemas and subdocuments, but you can also declare nested path aliases inline as long as you use the full nested path `nested.myProp` as the alias.

```js
const childSchema = new Schema({
  n: {
    type: String,
    alias: 'name'
  }
}, { _id: false });

const parentSchema = new Schema({
  // If in a child schema, alias doesn't need to include the full nested path
  c: childSchema,
  name: {
    f: {
      type: String,
      // Alias needs to include the full nested path if declared inline
      alias: 'name.first'
    }
  }
});
```

### 5.2 Models

Models are fancy constructors compiled from `Schema` definitions. An instance of a model is called a document. Models are responsible for creating and reading documents from the underlying MongoDB database.

### 5.3 CRUD with Mongoose

Mongoose models provide several static helper functions for CRUD operations. Each of these functions returns a mongoose Query object.

A mongoose query can be executed in one of two ways. First, if you pass in a `callback` function, Mongoose will execute the query asynchronously and pass the results to the `callback`.

A query also has a `.then()` function, and thus can be used as a promise.

#### **Create (C)**

* Create a model with the properties that you want
* Save the model into a database with `.save()`

```js
const small = new Tank({ size: 'small' });
small.save(function (err) {
  if (err) return handleError(err);
  // saved!
});
```

#### **Read (R)**

* You can you `.find()` to read the documents.

```js
// find all documents
await MyModel.find({});

// find all documents named john and at least 18
await MyModel.find({ name: 'john', age: { $gte: 18 } }).exec();

// executes, passing results to callback
MyModel.find({ name: 'john', age: { $gte: 18 }}, function (err, docs) {});

// executes, name LIKE john and only selecting the "name" and "friends" fields
await MyModel.find({ name: /john/i }, 'name friends').exec();

// passing options
await MyModel.find({ name: /john/i }, null, { skip: 10 }).exec();
```

* If you want to read one document you can use `.findOne()`

```js
// Find one adventure whose `country` is 'Croatia', otherwise `null`
await Adventure.findOne({ country: 'Croatia' }).exec();

// using callback
Adventure.findOne({ country: 'Croatia' }, function (err, adventure) {});

// select only the adventures name and length
await Adventure.findOne({ country: 'Croatia' }, 'name length').exec();
```

**Note**: `conditions` is optional, and if `conditions` is null or undefined, mongoose will send an empty `findOne` command to MongoDB, which will return an arbitrary document. If you're querying by `_id`, use `findById()` instead.

#### **Update (U)**

* You can use `.updateOne()` to update a document. MongoDB will update only the first document that matches filter regardless of the value of the multi option.

```js
const res = await Person.updateOne({ name: 'Jean-Luc Picard' }, { ship: 'USS Enterprise' });
res.matchedCount; // Number of documents matched
res.modifiedCount; // Number of documents modified
res.acknowledged; // Boolean indicating everything went smoothly.
res.upsertedId; // null or an id containing a document that had to be upserted.
res.upsertedCount; // Number indicating how many documents had to be upserted. Will either be 0 or 1.
```

* Use `replaceOne()` if you want to overwrite an entire document rather than using atomic operators like `$set`.

#### **Delete (D)**

* You can use `.deleteOne()` to delete the first document that matches conditions from the collection. It returns an object with the property `deletedCount` indicating how many documents were deleted. Behaves like `remove()`, but deletes at most one document regardless of the `single` option.

```js
await Character.deleteOne({ name: 'Eddard Stark' }); // returns {deletedCount: 1}
```

### 5.4 Populate

Mongoose has a more powerful alternative called `populate()`, which lets you reference documents in other collections.

Population is the process of automatically replacing the specified paths in the document with document(s) from other collection(s).

```js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const personSchema = Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  age: Number,
  stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
});

const storySchema = Schema({
  author: { type: Schema.Types.ObjectId, ref: 'Person' },
  title: String,
  fans: [{ type: Schema.Types.ObjectId, ref: 'Person' }]
});

const Story = mongoose.model('Story', storySchema);
const Person = mongoose.model('Person', personSchema);
```

So far we've created two Models. Our `Person` model has its `stories` field set to an array of `ObjectId`s. The `ref` option is what tells Mongoose which model to use during population, in our case the `Story model`. All `_id`s we store here must be document `_id`s from the `Story` model.

#### **Saving refs**

Saving refs to other documents works the same way you normally save properties, just assign the `_id` value:

```js
const author = new Person({
  _id: new mongoose.Types.ObjectId(),
  name: 'Ian Fleming',
  age: 50
});

author.save(function (err) {
  if (err) return handleError(err);

  const story1 = new Story({
    title: 'Casino Royale',
    author: author._id    // assign the _id from the person
  });

  story1.save(function (err) {
    if (err) return handleError(err);
    // that's it!
  });
});
```

#### **Population**

So far we haven't done anything much different. We've merely created a Person and a Story. Now let's take a look at populating our story's author using the query builder:

```js
Story.
  findOne({ title: 'Casino Royale' }).
  populate('author').
  exec(function (err, story) {
    if (err) return handleError(err);
    console.log('The author is %s', story.author.name);
    // prints "The author is Ian Fleming"
  });
```

Populated paths are no longer set to their original `_id` , their value is replaced with the mongoose document returned from the database by performing a separate query before returning the results.

Arrays of refs work the same way. Just call the populate method on the query and an array of documents will be returned in place of the original `_id`s.

#### **Checking Whether a Field is Populated**

You can call the `populated()` function to check whether a field is populated. If `populated()` returns a truthy value, you can assume the field is populated.

```js
story.populated('author'); // truthy

story.depopulate('author'); // Make `author` not populated anymore
story.populated('author'); // undefined
```

A common reason for checking whether a path is populated is getting the `author` id. However, for your convenience, Mongoose adds a `_id` getter to ObjectId instances so you can use story.author._id regardless of whether `author` is populated.

```js
story.populated('author'); // truthy
story.author._id; // ObjectId

story.depopulate('author'); // Make `author` not populated anymore
story.populated('author'); // undefined

story.author instanceof ObjectId; // true
story.author._id; // ObjectId, because Mongoose adds a special getter
```

#### **Query conditions and other options**

What if we wanted to populate our fans array based on their age and select just their names?

```js
Story.
  find().
  populate({
    path: 'fans',
    match: { age: { $gte: 21 } },
    // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
    select: 'name -_id'
  }).
  exec();
```

The `match` option doesn't filter out `Story` documents. If there are no documents that satisfy `match`, you'll get a `Story` document with an empty `fans` array.

In general, there is no way to make `populate()` filter stories based on properties of the story's `author`. For example, the below query won't return any results, even though `author` is populated.

```js
const story = await Story.
  findOne({ 'author.name': 'Ian Fleming' }).
  populate('author').
  exec();
story; // null
```

#### **limit vs. perDocumentLimit**

Populate does support a `limit` option, however, it currently does not limit on a per-document basis for backwards compatibility. For example, suppose you have 2 stories:

```js
Story.create([
  { title: 'Casino Royale', fans: [1, 2, 3, 4, 5, 6, 7, 8] },
  { title: 'Live and Let Die', fans: [9, 10] }
]);
```

If you were to `populate()` using the limit option, you would find that the 2nd story has 0 fans:

```js
const stories = await Story.find().populate({
  path: 'fans',
  options: { limit: 2 }
});

stories[0].name; // 'Casino Royale'
stories[0].fans.length; // 2

// 2nd story has 0 fans!
stories[1].name; // 'Live and Let Die'
stories[1].fans.length; // 0
```

That's because, in order to avoid executing a separate query for each document, Mongoose instead queries for fans using `numDocuments * limit` as the limit. If you need the correct `limit`, you should use the `perDocumentLimit` option (new in Mongoose 5.9.0). Just keep in mind that `populate()` will execute a separate query for each story, which may cause `populate()` to be slower.

```js
const stories = await Story.find().populate({
  path: 'fans',
  // Special option that tells Mongoose to execute a separate query
  // for each `story` to make sure we get 2 fans for each story.
  perDocumentLimit: 2
});

stories[0].name; // 'Casino Royale'
stories[0].fans.length; // 2

stories[1].name; // 'Live and Let Die'
stories[1].fans.length; // 2
```

#### **Refs to children**

We may find however, if we use the `author` object, we are unable to get a list of the stories. This is because no story objects were ever 'pushed' onto `author.stories`.

There are two perspectives here. First, you may want the `author` to know which stories are theirs. Usually, your schema should resolve one-to-many relationships by having a parent pointer in the 'many' side. But, if you have a good reason to want an array of child pointers, you can `push()` documents onto the array as shown below.

```js
story1.save()

author.stories.push(story1);
author.save(callback);
```

This allows us to perform a `find` and `populate` combo:

```js
Person.
  findOne({ name: 'Ian Fleming' }).
  populate('stories'). // only works if we pushed refs to children
  exec(function (err, person) {
    if (err) return handleError(err);
    console.log(person);
  });
```

It is debatable that we really want two sets of pointers as they may get out of sync. Instead we could skip populating and directly `find()` the stories we are interested in.

```js
Story.
  find({ author: author._id }).
  exec(function (err, stories) {
    if (err) return handleError(err);
    console.log('The stories are an array: ', stories);
  });
```

The documents returned from query population become fully functional, `removeable`, `saveable` documents unless the lean option is specified. Do not confuse them with sub docs. Take caution when calling its remove method because you'll be removing it from the database, not just the array.

#### **Dynamic References via `refPath`**

Mongoose can also populate from multiple collections based on the value of a property in the document. Let's say you're building a schema for storing comments. A user may comment on either a blog post or a product.

```js
const commentSchema = new Schema({
  body: { type: String, required: true },
  doc: {
    type: Schema.Types.ObjectId,
    required: true,
    // Instead of a hardcoded model name in `ref`, `refPath` means Mongoose
    // will look at the `onModel` property to find the right model.
    refPath: 'docModel'
  },
  docModel: {
    type: String,
    required: true,
    enum: ['BlogPost', 'Product']
  }
});

const Product = mongoose.model('Product', new Schema({ name: String }));
const BlogPost = mongoose.model('BlogPost', new Schema({ title: String }));
const Comment = mongoose.model('Comment', commentSchema);
```

The refPath option is a more sophisticated alternative to ref. If ref is a string, Mongoose will always query the same model to find the populated subdocs. With refPath, you can configure what model Mongoose uses for each document.

```js
const book = await Product.create({ name: 'The Count of Monte Cristo' });
const post = await BlogPost.create({ title: 'Top 10 French Novels' });

const commentOnBook = await Comment.create({
  body: 'Great read',
  doc: book._id,
  docModel: 'Product'
});

const commentOnPost = await Comment.create({
  body: 'Very informative',
  doc: post._id,
  docModel: 'BlogPost'
});

// The below `populate()` works even though one comment references the
// 'Product' collection and the other references the 'BlogPost' collection.
const comments = await Comment.find().populate('doc').sort({ body: 1 });
comments[0].doc.name; // "The Count of Monte Cristo"
comments[1].doc.title; // "Top 10 French Novels"
```

#### **Populate Virtuals**

Virtual populate means calling `populate()` on a virtual property that has a `ref` option as shown below.

```js
const AuthorSchema = new Schema({
  name: String,
  
});

const BlogPostSchema = new Schema({
  title: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
  comments: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
    content: String
  }]
});

AuthorSchema.virtual('posts', {
  ref: 'BlogPost',
  localField: '_id',
  foreignField: 'author'
});
const Author = mongoose.model('Author', AuthorSchema, 'Author');
const BlogPost = mongoose.model('BlogPost', BlogPostSchema, 'BlogPost');
```

You can then `populate()` the author's posts as shown below

```js
const author = await Author.findOne().populate('posts');

author.posts[0].title; // Title of the first blog post
```

#### **Populate Maps**

Maps are a type that represents an object with arbitrary string keys. For example, in the below schema, `members` is a map from strings to ObjectIds.

```js
const BandSchema = new Schema({
  name: String,
  members: {
    type: Map,
    of: {
      type: 'ObjectId',
      ref: 'Person'
    }
  }
});
const Band = mongoose.model('Band', bandSchema);
```

This map has a `ref`, which means you can use `populate()` to populate all the ObjectIds in the map. Suppose you have the below `band` document:

```js
const person1 = new Person({ name: 'Vince Neil' });
const person2 = new Person({ name: 'Mick Mars' });

const band = new Band({
  name: 'Motley Crue',
  members: {
    'singer': person1._id,
    'guitarist': person2._id
  }
});
```

You can populate() every element in the map by populating the special path `members.$*`. `$*` is a special syntax that tells Mongoose to look at every key in the map.

```js
const band = await Band.findOne({ name: 'Motley Crue' }).populate('members.$*');

band.members.get('singer'); // { _id: ..., name: 'Vince Neil' }
```

#### **Transform populated documents**

You can manipulate populated documents using the `transform` option. If you specify a transform function, Mongoose will call this function on every populated document in the result wiwith two arguments: the populated document, and the original id used to populate the document. This gives you more control over the result of the populate() execution. It is especially useful when you're populating multiple documents.

You can return any value from `transform()`. For example, you can use transform() to "flatten" populated documents as follows.

```js
let doc = await Parent.create({ children: [ { name: 'Luke' }, { name: 'Leia' } ] });

doc = await Parent.findById(doc).populate([{
  path: 'children',
  transform: doc => doc == null ? null : doc.name
}]);

doc.children; // ['Luke', 'Leia']
```

>## 6. MongoDB Advanced

### 6.1 Aggregation

An aggregation pipeline consists of one or more stages that process documents:

* Each stage performs an operation on the input documents. For example, a stage can filter documents, group documents, and calculate values.
* The documents that are output from a stage are passed to the next stage.
* An aggregation pipeline can return results for groups of documents. For example, return the total, average, maximum, and minimum values.

#### **Aggregation Pipeline Limits:**

* Result Size Restrictions: The `aggregate` command can either return a cursor or store the results in a collection. Each document in the result set is subject to the 16 megabyte BSON Document Size limit. If any single document exceeds the BSON Document Size limit, the aggregation produces an error. The limit only applies to the returned documents. During the pipeline processing, the documents may exceed this size. The `db.collection.aggregate()` method returns a cursor by default

#### **Different between Aggregation and MQL**

* Aggregation has `$group` stage that divide data into multiples group in order to compute and reshape data. Non-filtering stages do not modify the original data. Instead they work with the data in the cursor (previous stage).

#### **$match**

Filters the documents to pass only the documents that match the specified condition(s) to the next pipeline stage.

```js
{ $match: { <query> } }
```

`$match` should be the first stage of aggregation.  Because `$match` limits the total number of documents in the aggregation pipeline, earlier `$match` operations minimize the amount of processing down the pipe.

Retrictions:

* The `$match` query syntax is identical to the read operation query syntax; i.e. `$match` does not accept raw aggregation expressions. To include aggregation expression in `$match`, use a `$expr` query expression:

```js
{ $match: { $expr: { <aggregation expression> } } }
```

* You cannot use `$where` in `$match` queries as part of the aggregation pipeline.
* To use `$text` in the `$match`stage, the `$match`stage has to be the first stage of the pipeline. Views do not support text search.

Examples:

```js
db.articles.aggregation([
  {
    $match: [author: "dave"]
  }
])
```

#### **$project**

Passes along the documents with the requested fields to the next stage in the pipeline. The specified fields can be existing fields from the input documents or newly computed fields.

The `$project`takes a document that can specify the inclusion of fields, the suppression of the `_id` field, the addition of new fields, and the resetting of the values of existing fields. Alternatively, you may specify the exclusion of fields.

**Suppress the _id Field**:
By default, the `_id` field is included in the output documents. To exclude the `_id` field from the output documents, you must explicitly specify the suppression of the `_id` field in `$project`

**Path Collision Errors in Embedded Fields**:

You cannot specify both an embedded document and a field within that embedded document in the same projection.

The following `$project` stage fails with a `Path collision` error because it attempts to project both the embedded contact document and the `contact.address.country` field:

```js
{ $project: { contact: 1, "contact.address.country": 1 } } //error
```

**Restrictions**:

An error is returned if the `$project` specification is an empty document.

**Things to Remeber**:
Once we specify one field to retain, we must specify all fields we want to retain. The `_id` field is the only exception to this

Beyond simply removing and retaining fields, `$project` lets us add new fields

`$project` can be used as many times as required within an Aggregation pipeline

`$project` can be used to reassign values to existing field names and to derive entirely new fields

**Example**:

Consider a books collection with the following document:

```js
{
  "_id" : 1,
  title: "abc123",
  isbn: "0001122223334",
  author: { last: "zzz", first: "aaa" },
  copies: 5,
  lastModified: "2016-07-28"
}
```

The following `$project` stage excludes the `author.first` and `lastModified` fields from the output:

```js
db.books.aggregation([
  {
    $project: {"athour.first": 0, lastModified: 0}
  }
])
```

#### **$geoNear**

Outputs documents in order of nearest to farthest from a specified point.

**Behavior**:
You can only use `$geoNear` as the first stage of a pipeline.

You must include the `distanceField` option. The `distanceField` option specifies the field that will contain the calculated distance.

`$geoNear` requires a geospatial index.

**Example**:

Create a collection places with the following documents:

```js
db.places.insertMany( [
   {
      name: "Central Park",
      location: { type: "Point", coordinates: [ -73.97, 40.77 ] },
      category: "Parks"
   },
   {
      name: "Sara D. Roosevelt Park",
      location: { type: "Point", coordinates: [ -73.9928, 40.7193 ] },
      category: "Parks"
   },
   {
      name: "Polo Grounds",
      location: { type: "Point", coordinates: [ -73.9375, 40.8303 ] },
      category: "Stadiums"
   }
] )

db.places.createIndex( { location: "2dsphere" } )
```

The places collection above has a `2dsphere` index. The following aggregation uses `$geoNear` to find documents with a location at most 2 meters from the center `[ -73.99279 , 40.719296 ]` and `category` equal to `Parks`.

```js
db.places.aggregate([
  {
    $geoNear: {
      near: {type: "Point", coordinates: [-73.99279,40.719296]}
      distanceField: "dist.calculated",
      maxDistance: 2,
      query: {category: "Parks"},
      includeLocs: "dis.location",
      spherical: true
    }
  }
])
// expected result
{
   "_id" : 8,
   "name" : "Sara D. Roosevelt Park",
   "category" : "Parks",
   "location" : {
      "type" : "Point",
      "coordinates" : [ -73.9928, 40.7193 ]
   },
   "dist" : {
      "calculated" : 0.9539931676365992,
      "location" : {
         "type" : "Point",
         "coordinates" : [ -73.9928, 40.7193 ]
      }
   }
}
```

`$geoNear` with the let option:

```js
db.places.aggregate([
  {
    $geoNear: {
      "near": "$$pt",
      "distanceField": "distance",
      "maxDistance": 2,
      "query": ["category": "Parks"],
      "includeLocs": "dist.location",
      "spherical": true
    }
  },
  { $limit: 5 } //
],
{
   "let":{ "pt": [ -73.99279, 40.719296 ] }
}
)
```

**Things to Remember**:

The collection one and only one 2dsphere index

If using 2dsphere, the distance is returned in meters. If using legacy coordinates, the distance return in radians

`$geoNear` must be the first stage in an aggregation pipeline

#### **sample Stages**

Randomly selects the specified number of documents from the input documents.

**Behavior**:

If all of the following conditions are true, `$sample` uses a pseudo-random cursor to select the N documents:

* `$sample` is the first stage of the pipeline.
* N is less than 5% of the total documents in the collection.
* The collection contains more than 100 documents.

If any of the previous conditions are false, `$sample`

* Reads all documents that are output from a preceding aggregation stage or a collection scan.
* Performs a random sort to select N documents.

**Example**:
Given a collection named `users` with the following documents:

```js
{ "_id" : 1, "name" : "dave123", "q1" : true, "q2" : true }
{ "_id" : 2, "name" : "dave2", "q1" : false, "q2" : false  }
{ "_id" : 3, "name" : "ahn", "q1" : true, "q2" : true  }
{ "_id" : 4, "name" : "li", "q1" : true, "q2" : false  }
{ "_id" : 5, "name" : "annT", "q1" : false, "q2" : true  }
{ "_id" : 6, "name" : "li", "q1" : true, "q2" : true  }
{ "_id" : 7, "name" : "ty", "q1" : false, "q2" : true  }
```

The following aggregation operation randomly selects 3 documents from the collection:

```js
db.users.aggregate(
   [ { $sample: { size: 3 } } ]
)
```

#### **$group**

The `$group` stage separates documents into groups according to a "group key". The output is one document for each unique group key.

A group key is often a field, or group of fields. The group key can also be the result of an expression. Use the `_id` field in the `$group` pipeline stage to set the group key.

**Example:**

**Count the Number of Documents in a Collection:**

Create a sample collection named sales with the following documents:

```js
db.sales.insertMany([
  { "_id" : 1, "item" : "abc", "price" : NumberDecimal("10"), "quantity" : NumberInt("2"), "date" : ISODate("2014-03-01T08:00:00Z") },
  { "_id" : 2, "item" : "jkl", "price" : NumberDecimal("20"), "quantity" : NumberInt("1"), "date" : ISODate("2014-03-01T09:00:00Z") },
  { "_id" : 3, "item" : "xyz", "price" : NumberDecimal("5"), "quantity" : NumberInt( "10"), "date" : ISODate("2014-03-15T09:00:00Z") },
  { "_id" : 4, "item" : "xyz", "price" : NumberDecimal("5"), "quantity" :  NumberInt("20") , "date" : ISODate("2014-04-04T11:21:39.736Z") },
  { "_id" : 5, "item" : "abc", "price" : NumberDecimal("10"), "quantity" : NumberInt("10") , "date" : ISODate("2014-04-04T21:23:13.331Z") },
  { "_id" : 6, "item" : "def", "price" : NumberDecimal("7.5"), "quantity": NumberInt("5" ) , "date" : ISODate("2015-06-04T05:08:13Z") },
  { "_id" : 7, "item" : "def", "price" : NumberDecimal("7.5"), "quantity": NumberInt("10") , "date" : ISODate("2015-09-10T08:43:00Z") },
  { "_id" : 8, "item" : "abc", "price" : NumberDecimal("10"), "quantity" : NumberInt("5" ) , "date" : ISODate("2016-02-06T20:20:13Z") },
])
```

The following aggregation operation uses the `$group` stage to count the number of documents in the sales collection:

```js
db.sales.aggregate( [
  {
    $group: {
       _id: null,
       count: { $count: { } }
    }
  }
] )

// expected output
{ "_id" : null, "count" : 8 }
```

**Calculate Count, Sum, and Average:**

Create a sample collection named sales with the following documents:

```js
db.sales.insertMany([
  { "_id" : 1, "item" : "abc", "price" : NumberDecimal("10"), "quantity" : NumberInt("2"), "date" : ISODate("2014-03-01T08:00:00Z") },
  { "_id" : 2, "item" : "jkl", "price" : NumberDecimal("20"), "quantity" : NumberInt("1"), "date" : ISODate("2014-03-01T09:00:00Z") },
  { "_id" : 3, "item" : "xyz", "price" : NumberDecimal("5"), "quantity" : NumberInt( "10"), "date" : ISODate("2014-03-15T09:00:00Z") },
  { "_id" : 4, "item" : "xyz", "price" : NumberDecimal("5"), "quantity" :  NumberInt("20") , "date" : ISODate("2014-04-04T11:21:39.736Z") },
  { "_id" : 5, "item" : "abc", "price" : NumberDecimal("10"), "quantity" : NumberInt("10") , "date" : ISODate("2014-04-04T21:23:13.331Z") },
  { "_id" : 6, "item" : "def", "price" : NumberDecimal("7.5"), "quantity": NumberInt("5" ) , "date" : ISODate("2015-06-04T05:08:13Z") },
  { "_id" : 7, "item" : "def", "price" : NumberDecimal("7.5"), "quantity": NumberInt("10") , "date" : ISODate("2015-09-10T08:43:00Z") },
  { "_id" : 8, "item" : "abc", "price" : NumberDecimal("10"), "quantity" : NumberInt("5" ) , "date" : ISODate("2016-02-06T20:20:13Z") },
])
```

The following pipeline calculates the total sales amount, average sales quantity, and sale count for each day in the year 2014:

```js
db.sales.aggregate([
  {
    $match: {"date": {$gte: new ISODate("2014-01-01"), $lte: new ISODate("2015-01-01")}}
  },
  {
    $group: {
      _id: {dateToString: {format: "%Y-%m-%d", date: "$date"}},
      totalSaleAmount: {$sum: {$multiply: ["$price","$quantity"]}}
      averageQuantity: {$avg: "$quantity"},
      count: {$sum: 1}
    }
  },
  {
    $sort: {totalSaleAmount: -1}
  }
])

//expected output
{
  "_id" : null,
  "totalSaleAmount" : NumberDecimal("452.5"),
  "averageQuantity" : 7.875,
  "count" : 8
}
```

#### **$unwind**

Deconstructs an array field from the input documents to output a document for each element. Each output document is the input document with the value of the array field replaced by the element.

**Behaviors:**

**Non-Array Field Path:**

* When the operand does not resolve to an array, but is not missing, null, or an empty array, $unwind treats the operand as a single element array.
* When the operand is null, missing, or an empty array $unwind follows the behavior set for the `preserveNullAndEmptyArrays` option.

**Missing Field:**

If you specify a path for a field that does not exist in an input document or the field is an empty array, `$unwind`, by default, ignores the input document and will not output documents for that input document.

**Example:**

Create a sample collection named inventory with the following document:

```js
db.inventory.insertOne({ "_id" : 1, "item" : "ABC1", sizes: [ "S", "M", "L"] })
```

The following aggregation uses the `$unwind` stage to output a document for each element in the sizes array:

```js
db.inventory.aggregate( [ { $unwind : "$sizes" } ] )

//expected output
{ "_id" : 1, "item" : "ABC1", "sizes" : "S" }
{ "_id" : 1, "item" : "ABC1", "sizes" : "M" }
{ "_id" : 1, "item" : "ABC1", "sizes" : "L" }
```

#### **$lookup**

Performs a left outer join to a collection in the same database to filter in documents from the "joined" collection for processing. The `$lookup`stage adds a new array field to each input document. The new array field contains the matching documents from the "joined" collection. The `$lookup` stage passes these reshaped documents to the next stage

**Syntax:**

**Equality Match with a Single Join Condition:**

```js
{
   $lookup:
     {
       from: <collection to join>,
       localField: <field from the input documents>,
       foreignField: <field from the documents of the "from" collection>,
       as: <output array field>
     }
}
```

**Join Conditions and Subqueries on a Joined Collection:**

To perform correlated and uncorrelated subqueries with two collections, and perform other join conditions besides a single equality match, use this `$lookup` syntax:

```js
{
   $lookup:
      {
         from: <joined collection>,
         let: { <var_1>: <expression>, …, <var_n>: <expression> },
         pipeline: [ <pipeline to run on joined collection> ],
         as: <output array field>
      }
}
```

**Behavior:**

**Views and Collation:**

If performing an aggregation that involves multiple views, such as with `$lookup` or `$graphLookup`, the views must have the same collation.

**Restriction:**

You cannot include the `$out` or the `$merge` stage in the `$lookup` stage. That is, when specifying a pipeline for the joined collection, you cannot include either stage in the pipeline field.

**Example:**

Create a collection `orders` with these documents:

```js
db.orders.insertMany( [
   { "_id" : 1, "item" : "almonds", "price" : 12, "quantity" : 2 },
   { "_id" : 2, "item" : "pecans", "price" : 20, "quantity" : 1 },
   { "_id" : 3  }
] )
```

Create another collection `inventory` with these documents:

```js
db.inventory.insertMany( [
   { "_id" : 1, "sku" : "almonds", "description": "product 1", "instock" : 120 },
   { "_id" : 2, "sku" : "bread", "description": "product 2", "instock" : 80 },
   { "_id" : 3, "sku" : "cashews", "description": "product 3", "instock" : 60 },
   { "_id" : 4, "sku" : "pecans", "description": "product 4", "instock" : 70 },
   { "_id" : 5, "sku": null, "description": "Incomplete" },
   { "_id" : 6 }
] )
```

The following aggregation operation on the `orders` collection joins the documents from `orders` with the documents from the `inventory` collection using the fields `item` from the `orders` collection and the `sku` field from the `inventory` collection:

```js
db.orders.aggregate( [
   {
     $lookup:
       {
         from: "inventory",
         localField: "item",
         foreignField: "sku",
         as: "inventory_docs"
       }
  }
] )

//expected output
{
   "_id" : 1,
   "item" : "almonds",
   "price" : 12,
   "quantity" : 2,
   "inventory_docs" : [
      { "_id" : 1, "sku" : "almonds", "description" : "product 1", "instock" : 120 }
   ]
}
{
   "_id" : 2,
   "item" : "pecans",
   "price" : 20,
   "quantity" : 1,
   "inventory_docs" : [
      { "_id" : 4, "sku" : "pecans", "description" : "product 4", "instock" : 70 }
   ]
}
{
   "_id" : 3,
   "inventory_docs" : [
      { "_id" : 5, "sku" : null, "description" : "Incomplete" },
      { "_id" : 6 }
   ]
}
```

**Use `$lookup` with `$mergeObjects`**

We have 2 collections is `orders` and `items` likely below:

```js
db.orders.insertMany( [
   { "_id" : 1, "item" : "almonds", "price" : 12, "quantity" : 2 },
   { "_id" : 2, "item" : "pecans", "price" : 20, "quantity" : 1 }
] )

db.items.insertMany( [
  { "_id" : 1, "item" : "almonds", description: "almond clusters", "instock" : 120 },
  { "_id" : 2, "item" : "bread", description: "raisin and nut bread", "instock" : 80 },
  { "_id" : 3, "item" : "pecans", description: "candied pecans", "instock" : 60 }
] )
```

The following operation first uses the `$lookup` stage to join the two collections by the `item` fields and then uses `$mergeObjects` in the `$replaceRoot` to merge the joined documents from items and orders:

```js
db.orders.aggregate( [
   {
      $lookup: {
         from: "items",
         localField: "item",    // field in the orders collection
         foreignField: "item",  // field in the items collection
         as: "fromItems"
      }
   },
   {
      $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromItems", 0 ] }, "$$ROOT" ] } }
   },
   { $project: { fromItems: 0 } }
] )

//expected output
{
  _id: 1,
  item: 'almonds',
  description: 'almond clusters',
  instock: 120,
  price: 12,
  quantity: 2
},
{
  _id: 2,
  item: 'pecans',
  description: 'candied pecans',
  instock: 60,
  price: 20,
  quantity: 1
}
```

#### **$graphLookup**

Performs a recursive search on a collection, with options for restricting the search by recursion depth and query filter.

The `$graphLookup` search process is summarized below:

1. Input documents flow into the $graphLookup stage of an aggregation operation.

2. `$graphLookup` targets the search to the collection designated by the from parameter (see below for full list of search parameters).

3. For each input document, the search begins with the value designated by startWith.

4. `$graphLookup` matches the `startWith` value against the field designated by `connectToField` in other documents in the `from` collection.

5. For each matching document, `$graphLookup` takes the value of the `connectFromField` and checks every document in the `from` collection for a matching `connectToField` value. For each match, `$graphLookup` adds the matching document in the `from` collection to an array field named by the `as` parameter. This step continues recursively until no more matching documents are found, or until the operation reaches a recursion depth specified by the `maxDepth` parameter. `$graphLookup` then appends the array field to the input document. `$graphLookup` returns results after completing its search on all input documents.

**Syntax:**

```js
{
   $graphLookup: {
      from: <collection>,
      startWith: <expression>,
      connectFromField: <string>,
      connectToField: <string>,
      as: <string>,
      maxDepth: <number>,
      depthField: <string>,
      restrictSearchWithMatch: <document>
   }
}
```

**Example:**

**Within a Single Collection:**

Assume we have the following documents:

```js
{ "_id" : 1, "name" : "Dev" }
{ "_id" : 2, "name" : "Eliot", "reportsTo" : "Dev" }
{ "_id" : 3, "name" : "Ron", "reportsTo" : "Eliot" }
{ "_id" : 4, "name" : "Andrew", "reportsTo" : "Eliot" }
{ "_id" : 5, "name" : "Asya", "reportsTo" : "Ron" }
{ "_id" : 6, "name" : "Dan", "reportsTo" : "Andrew" }
```

The following `$graphLookup` operation recursively matches on the `reportsTo` and `name`   fields in the `employees` collection, returning the reporting hierarchy for each person:

```js
db.employees.aggregate( [
   {
      $graphLookup: {
         from: "employees",
         startWith: "$reportsTo",
         connectFromField: "reportsTo",
         connectToField: "name",
         as: "reportingHierarchy"
      }
   }
] )

//expected output
{
   "_id" : 1,
   "name" : "Dev",
   "reportingHierarchy" : [ ]
}
{
   "_id" : 2,
   "name" : "Eliot",
   "reportsTo" : "Dev",
   "reportingHierarchy" : [
      { "_id" : 1, "name" : "Dev" }
   ]
}
{
   "_id" : 3,
   "name" : "Ron",
   "reportsTo" : "Eliot",
   "reportingHierarchy" : [
      { "_id" : 1, "name" : "Dev" },
      { "_id" : 2, "name" : "Eliot", "reportsTo" : "Dev" }
   ]
}
{
   "_id" : 4,
   "name" : "Andrew",
   "reportsTo" : "Eliot",
   "reportingHierarchy" : [
      { "_id" : 1, "name" : "Dev" },
      { "_id" : 2, "name" : "Eliot", "reportsTo" : "Dev" }
   ]
}
{
   "_id" : 5,
   "name" : "Asya",
   "reportsTo" : "Ron",
   "reportingHierarchy" : [
      { "_id" : 1, "name" : "Dev" },
      { "_id" : 2, "name" : "Eliot", "reportsTo" : "Dev" },
      { "_id" : 3, "name" : "Ron", "reportsTo" : "Eliot" }
   ]
}
{
   "_id" : 6,
   "name" : "Dan",
   "reportsTo" : "Andrew",
   "reportingHierarchy" : [
      { "_id" : 1, "name" : "Dev" },
      { "_id" : 2, "name" : "Eliot", "reportsTo" : "Dev" },
      { "_id" : 4, "name" : "Andrew", "reportsTo" : "Eliot" }
   ]
}
```

#### **$bucket**

Categorizes incoming documents into groups, called buckets, based on a specified expression and bucket boundaries and outputs a document per each bucket. Each output document contains an _id field whose value specifies the inclusive lower bound of the bucket.

`$bucket` only produces output documents for buckets that contain at least one input document.

#### **$out**

Takes the documents returned by the aggregation pipeline and writes them to a specified collection.

The `$out` stage must be the last stage in the pipeline. The `$out` operator lets the aggregation framework return result sets of any size.

`$out` replaces the specified collection if it exists

**Examples:**

Create a collection `books` with the following documents:

```js
db.getSiblingDB("test").books.insertMany([
   { "_id" : 8751, "title" : "The Banquet", "author" : "Dante", "copies" : 2 },
   { "_id" : 8752, "title" : "Divine Comedy", "author" : "Dante", "copies" : 1 },
   { "_id" : 8645, "title" : "Eclogues", "author" : "Dante", "copies" : 2 },
   { "_id" : 7000, "title" : "The Odyssey", "author" : "Homer", "copies" : 10 },
   { "_id" : 7020, "title" : "Iliad", "author" : "Homer", "copies" : 10 }
])
```

The following aggregation operation pivots the data in the `books` collection in the test database to have titles grouped by authors and then writes the results to the `authors` collection, also in the `test` database.

```js
db.getSiblingDB("test").books.aggregate( [
    { $group : { _id : "$author", books: { $push: "$title" } } },
    { $out : "authors" }
] )

//expected output

{ "_id" : "Homer", "books" : [ "The Odyssey", "Iliad" ] }
{ "_id" : "Dante", "books" : [ "The Banquet", "Divine Comedy", "Eclogues" ] }
```

### 6.2 Indexes

Indexes support the efficient execution of queries in MongoDB. Without indexes, MongoDB must perform a collection scan, i.e. scan every document in a collection, to select those documents that match the query statement. If an appropriate index exists for a query, MongoDB can use the index to limit the number of documents it must inspect.

Indexes are special data structures [1] that store a small portion of the collection's data set in an easy to traverse form. The index stores the value of a specific field or set of fields, ordered by the value of the field. The ordering of the index entries supports efficient equality matches and range-based query operations. In addition, MongoDB can return sorted results by using the ordering in the index.

Cons: With each additional index, wwe decrease our write speed for a collection. We don't want to have too many unecessary indexes in a collection because they would be unnecessary loss in insert, update, delete performance

#### **Index Types**

>**Single Field**

In addition to the MongoDB-defined `_id` index, MongoDB supports the creation of user-defined ascending/descending indexes on a single field of a document.

>**Compound Index**

MongoDB supports compound indexes, where a single index structure holds references to multiple fields [1] within a collection's documents. The following diagram illustrates an example of a compound index on two fields:

![compound Index](https://www.mongodb.com/docs/manual/images/index-compound-key.bakedsvg.svg)

**Sort Order**: Indexes store references to fields in either ascending (1) or descending (-1) sort order. For single-field indexes, the sort order of keys doesn't matter because MongoDB can traverse the index in either direction. However, for compound indexes, sort order can matter in determining whether the index can support a sort operation.

**Prefixes**: Index prefixes are the beginning subsets of indexed fields. For example, consider the following compound index:

```js
{ "item": 1, "location": 1, "stock": 1 }
```

For a compound index, MongoDB can use the index to support queries on the index prefixes. As such, MongoDB can use the index for queries on the following fields:

* the `item` field,

* the `item` field and the `location` field,

* the `item`field and the `location` field and the `stock` field.

MongoDB cannot use the index to support queries that include the following fields since without the item field, none of the listed fields correspond to a prefix index:

* the `location` field,

* the `stock` field, or

* the `location` and `stock`fields.

> **Multikey Indexes**

To index a field that holds an array value, MongoDB creates an index key for each element in the array. These multikey indexes support efficient queries against array fields. Multikey indexes can be constructed over arrays that hold both scalar values [1] (e.g. strings, numbers) and nested documents.

**Limitations**:

* For a compound multikey index, each indexed document can have at most one indexed field whose value is an array. That is:
  * You cannot create a compound multikey index if more than one to-be-indexed field of a document is an array
  * Or, if a compound multikey index already exists, you cannot insert a document that would violate this restriction.
* Multikey Indexes don't support covered queries

> **Text Indexes**

 A collection can only have one text search index, but that index can cover multiple fields.

 You can index multiple fields for the text index. The following example creates a `text` index on the fields `subject`and `comments`:

The server is going to process this text field and create an index key for every unique word in the string

 ```js
db.reviews.createIndex(
   {
     subject: "text",
     comments: "text"
   }
 )
 ```

**Cons**:

* More keys to examine
* Increased index size
* Increased time to build index
* Decreased write performance

To prevent the cons above, we should creating a compound index.

**Restrictions**:

* **One Text Index Per Collection**
  * A collection can have at most one text index.
* **Text Search and Hints**
  * You cannot use hint() if the query includes a $text query expression.
* **Text Index and Sort**
  * Sort operations cannot obtain sort order from a text index, even from a compound text index
* **Compound Index**

**Storage Requirements and Performance Costs**:

`text` indexes can be large. They contain one index entry for each unique post-stemmed word in each indexed field for each document inserted.

Building a `text` index is very similar to building a large multi-key index and will take longer than building a simple ordered (scalar) index on the same data.

When building a large text `index` on an existing collection, ensure that you have a sufficiently high limit on open file descriptors.

`text` indexes will impact insertion throughput because MongoDB must add an index entry for each unique post-stemmed word in each indexed field of each new source document.

Additionally, `text` indexes do not store phrases or information about the proximity of words in the documents. As a result, phrase queries will run much more effectively when the entire collection fits in RAM.

### 6.3 Indexes Strategy

> **The ESR Rule**

**Equality**:

Index searches make efficient use of exact matches to limit the number of documents that need to be examined to satisfy a query. Place fields that require exact matches first in your index.

An index may have multiple keys for queries with exact matches. The index keys for equality matches can appear in any order. However, to satisfy an equality match with the index, all of the index keys for exact matches must come before any other index fields. MongoDB's search algorithm eliminates any need to arrange the exact match fields in a particular order.

Exact matches should be selective. To reduce the number of index keys scanned, ensure equality tests eliminate at least 90% of possible document matches.

**Sort**:

"Sort" determines the order for results. Sort follows equality matches because the equality matches reduce the number of documents that need to be sorted. Sorting after the equality matches also allows MongoDB to do a non-blocking sort.

An index can support sort operations when the query fields are a subset of the index keys. Sort operations on a subset of the index keys are only supported if the query includes equality conditions for all of the prefix keys that precede the sort keys.

The following example queries the cars collection. The output is sorted by model:

```js
db.cars.find( { manufacturer: "GM" } ).sort( { model: 1 } )
```

To improve query performance, create an index on the manufacturer and model fields:

```js
db.cars.createIndex( { manufacturer: 1, model: 1 } )
```

**Range**:

"Range" filters scan fields. The scan doesn't require an exact match, which means range filters are loosely bound to index keys. To improve query efficiency, make the range bounds as tight as possible and use equality matches to limit the number of documents that must be scanned.

MongoDB cannot do an index sort on the results of a range filter. Place the range filter after the sort predicate so MongoDB can use a non-blocking index sort

**Example**:

The following query searches the cars collection for vehicles manufactured by Ford that cost more than $15,000 dollars. The results are sorted by model:

```js
db.cars.find(
   {
       manufacturer: 'Ford',
       cost: { $gt: 10000 }
   } ).sort( { model: 1 } )
```

Following the ESR rule, the optimal index for the example query is:

```js
{ manufacturer: 1, model: 1, cost: 1 }
```

>**Use Indexes to Sort Query Result**

**Sort with a Single Field Index**:

If an ascending or a descending index is on a single field, the sort operation on the field can be in either direction.

For example, create an ascending index on the field a for a collection `records`:

```js
db.records.createIndex( { a: 1 } )
```

This index can support also an ascending and desending sort on a:

```js
db.records.find().sort( { a: 1 } )
db.records.find().sort( { a: -1 } ) // This can work too
```

**Sort on Multiple Fields**:

You can specify a sort on all the keys of the index or on a subset; however, the sort keys must be listed in the same order as they appear in the index. For example, an index key pattern `{ a: 1, b: 1 }` can support a sort on `{ a: 1, b: 1 }` but not on `{ b: 1, a: 1 }`.

For a query to use a compound index for a sort, the specified sort direction for all keys in the cursor.sort() document must match the index key pattern or match the inverse of the index key pattern. For example, an index key pattern `{ a: 1, b: -1 }` can support a sort on `{ a: 1, b: -1 }` and `{ a: -1, b: 1 }` but not on `{ a: -1, b: -1 }` or `{a: 1, b: 1}`.

**Sort and Index Prefix**:

If the sort keys correspond to the index keys or an index prefix, MongoDB can use the index to sort the query results. A prefix of a compound index is a subset that consists of one or more keys at the start of the index key pattern.

**Sort and Non-prefix Subset of an Index**:

An index can support sort operations on a non-prefix subset of the index key pattern. To do so, the query must include **equality** conditions on all the prefix keys that precede the sort keys.

If the query does **not** specify an equality condition on an index prefix that precedes or overlaps with the sort specification, the operation will **not** efficiently use the index.

### 6.4 Data Modeling

#### **Relationships**

**One to Many:**

Prefer embedding over referencing for simplicity, or when there is a small number of referenced documents as all related information is kept together.

Prefer referencing when the associated documents are not always needed with the most often queried documents

**Many to Many:**

Prefer embedding for information that is primarily static over time and may profit from duplication

Prefer referencing over embedding to avoid managing duplication

#### **Pattern**

**Attribute Pattern:**

Problem:

* Lots of similar fields
* Want to search across many fields at one
* Fields present it only a small subset of documents.

Solution:

* Break the field/value into a sub-document

Benefits and Trade-Offs:

* Easier to index
* Allow for non-deterministic field names
* Ability to qualify the relationship of the original field and value