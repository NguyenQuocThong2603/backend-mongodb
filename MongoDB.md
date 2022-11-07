# Table of Contents

* [1. ORM](#1-orm)
* [2. Driver](#2-driver)
* [3. Schema](#3-schema)
* [4. Type of MongoDB](#4-type-of-mongodb)
* [5. Mongoose](#5-mongoose)

>## 1. ORM

ORM is a programming technique that helps to map data records in the database management system to the type of objects defined in classes.

**Object Relational Mapping (ORM)** is a technique used in creating a "bridge" between object-oriented programs and, in most cases, relational databases.

Put another way, you can see the ORM as the layer that connects object oriented programming (OOP) to relational databases.

The ORM and ORM tools help simplify the interaction between relational databases and different OOP languages.

### 1.1 What is an ORM Tool ?

An ORM tool is software designed to help OOP developers interact with relational databases.

Here's an example of SQL code that retrieves information about a particular user from a database:

```sql
"SELECT id, name, email, country, phone_number FROM users WHERE id = 20"
```

On the other hand, an ORM tool can do the same query as above with simpler methods. That is:

```sql
users.GetById(20)
```

### 1.2 Advantage of ORM

* It speeds up development time for teams.
* Easy to reuse and maintain.
* Improves security. ORM tools are built to eliminate the possibility of SQL injection attacks.
* A lot of things are done "automatically", regarding data processing.
* You don't need to know too much about that database management system, you can still easily access it through ORM.

### 1.3 Disadvantage of ORM

* With each framework there will be a different ORM library, so that you have to take time to learn it. And since they are libraries it will be very "heavy".
* They are likely not going to perform better when very complex queries are involved.
* ORMs are generally slower than using SQL.

### 1.4 Reason why ORM slower than Raw SQL

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

>## 3. Schema

### 3.1 What is a Schema ?

A schema is a JSON object that defines the the structure and contents of your data.

Schemas represent types of data rather than specific values.

### 3.2 Why define a Schema ?

Schemas are the specification for your application's data model. Once you've defined a schema, App Services provides you with additional tools and services to work with data that conforms to the schema.

App Services uses schemas in many application services:

* Atlas Device Sync uses schemas to sync data between realms and MongoDB Atlas. App Services can also generate idiomatic SDK object models for you based on your schemas.

* The GraphQL API uses schemas to automatically generate a GraphQL schema including types, queries, and mutations. You can extend your app's API with custom resolvers that reference the types defined by your schemas.

* Data Access Rules validate that data conforms to your schema before and after every request. If any document fails validation, App Services prevents or rolls back the entire request.

### 3.3 Define a Schema

A root-level collection schema can contain additional schemas that describe the type's properties. Each root-level schema is an object schema that has the following form:

```json
{
  "bsonType": "object",
  "title": "<Type Name>",
  "required": ["<Required Field Name>", ...],
  "properties": {
    "<Field Name>": <Schema>
  }
}
```

### 3.4 Relationships

A relationship is a connection between two documents. Relationships allow you to reference and query related documents in read and write operations, even if the documents are in separate databases or collections.

Relationships are unidirectional and don't enforce uniqueness or other foreign key constraints. If you reference a non-existent foreign value in a source field, App Services automatically omits the reference from resolved relationships.

### 3.5 To-One relationship

A to-one relationship links each source document with either a single document or an array of documents from the foreign collection.

### 3.6 To-Many relationship

A to-many relationship links each source document with a list of documents from the foreign collection.

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

* `Consistency`: means that the nodes will have the same copies of a replicated data item visible for various transactions. A guarantee that every node in a distributed cluster returns the same, most recent and a successful write. Consistency refers to every client having the same view of the data. There are various types of consistency models. Consistency in CAP refers to sequential consistency, a very strong form of consistency.
* `Availability`: means that each read or write request for a data item will either be processed successfully or will receive a message that the operation cannot be completed. Every non-failing node returns a response for all the read and write requests in a reasonable amount of time. The key word here is “every”. In simple terms, every node (on either side of a network partition) must be able to respond in a reasonable amount of time
* `Partition tolerance`: means that the system can continue operating even if the network connecting the nodes has a fault that results in two or more partitions, where the nodes in each partition can only communicate among each other. That means, the system continues to function and upholds its consistency guarantees in spite of network partitions. Network partitions are a fact of life. Distributed systems guaranteeing partition tolerance can gracefully recover from partitions once the partition heals

### 4.3 ACID Property

* `Atomicity`: the entire transaction takes place at once or doesn’t happen at all. Each transaction is considered as one unit and either runs to completion or is not executed at all.
* `Consistency`: This means that integrity constraints must be maintained so that the database is consistent before and after the transaction.
* `Isolation`: This property ensures that multiple transactions can occur concurrently without leading to the inconsistency of the database state. Transactions occur independently without interference. Changes occurring in a particular transaction will not be visible to any other transaction until that particular change in that transaction is written to memory or has been committed. This property ensures that the execution of transactions concurrently will result in a state that is equivalent to a state achieved these were executed serially in some order.
* `Durability`: This property ensures that once the transaction has completed execution, the updates and modifications to the database are stored in and written to disk and they persist even if a system failure occurs. These updates now become permanent and are stored in non-volatile memory. The effects of the transaction, thus, are never lost.

>## 5. Mongoose

### 5.1 Schemas

Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.

```js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const blogSchema = new Schema({
  title:  String, // String is shorthand for {type: String}
  author: String,
  body:   String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs:  Number
  }
});
```

Keys may also be assigned nested objects containing further key/type definitions. This will happen whenever a key's value is a POJO that doesn't have a `type` property.

In these cases, Mongoose only creates actual schema paths for leaves in the tree, and the branches do not have actual paths. A side-effect of this is that that property cannot have its own validation. If validation is needed up the tree, a path needs to be created up the tree.

Schemas not only define the structure of your document and casting of properties, they also define document instance methods, static Model methods, compound indexes, and document lifecycle hooks called middleware.

#### **Creating model**

To use our schema definition, we need to convert our blogSchema into a Model we can work with. To do so, we pass it into mongoose.model(modelName, schema):

```js
const Blog = mongoose.model('Blog', blogSchema);
// ready to go!
```

By default, Mongoose adds an `_id` property to your schemas.

When you create a new document with the automatically added `_id` property, Mongoose creates a new _id of type ObjectId to your document.

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

#### Virtuals

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

Suppose you want to print out the person's full name. You could do it yourself:

```js
console.log(axl.name.first + ' ' + axl.name.last); // Axl Rose
```

But concatenating the first and last name every time can get cumbersome. And what if you want to do some extra processing on the name, like removing diacritics? A virtual property getter lets you define a `fullName` property that won't get persisted to MongoDB.

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

// Or by using the virtual method as following:  
personSchema.virtual('fullName').get(function() {
  return this.name.first + ' ' + this.name.last;
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

// Or by using the virtual method as following:
personSchema.virtual('fullName').
  get(function() {
    return this.name.first + ' ' + this.name.last;
  }).
  set(function(v) {
    this.name.first = v.substr(0, v.indexOf(' '));
    this.name.last = v.substr(v.indexOf(' ') + 1);
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