# Table of Contents

* [1. ORM](#1-orm)
* [2. Driver](#2-driver)
* [3. Schema](#3-schema)
* [4. Type of MongoDB](#type-of-mongodb)

>## 1. ORM

ORM is a programming technique that helps to map data records in the database management system to the type of objects defined in classes.

**Object Relational Mapping (ORM)** is a technique used in creating a "bridge" between object-oriented programs and, in most cases, relational databases.

Put another way, you can see the ORM as the layer that connects object oriented programming (OOP) to relational databases.

The ORM and ORM tools help simplify the interaction between relational databases and different OOP languages.

### What is an ORM Tool ?

An ORM tool is software designed to help OOP developers interact with relational databases.

Here's an example of SQL code that retrieves information about a particular user from a database:

```sql
"SELECT id, name, email, country, phone_number FROM users WHERE id = 20"
```

On the other hand, an ORM tool can do the same query as above with simpler methods. That is:

```sql
users.GetById(20)
```

### Advantage of ORM

* It speeds up development time for teams.
* Easy to reuse and maintain.
* Improves security. ORM tools are built to eliminate the possibility of SQL injection attacks.
* A lot of things are done "automatically", regarding data processing.
* You don't need to know too much about that database management system, you can still easily access it through ORM.

### Disadvantage of ORM

* With each framework there will be a different ORM library, so that you have to take time to learn it. And since they are libraries it will be very "heavy".
* They are likely not going to perform better when very complex queries are involved.
* ORMs are generally slower than using SQL.

### Reason why ORM slower than Raw SQL

ORM needs time to create `Model instances`, create `properties` for the `model` and `transform`the model object into relational data before communicating with the database.

>## 2. Driver

A database driver is a computer program that implements a protocol (ODBC or JDBC) for a database connection. User can work with database through raw sql and the results will map into objects in their code

The driver works like an adaptor which connects a generic interface to a specific database vendor implementation.

### Advantage of Driver

* High performance
* Take up minimal space

### Disadvantage of Driver

* May require expertiese with queries and databases
* Schemas are not clearly defined or have no effect on the database

### Difference between ORM and Driver

| ORM | Driver |
| ----|--------|
|Low performance | High performance|
|SQL queries requierment is quite less | SQL queries requirement is high |
|There are not many retrictions while dealing with data| A lot of retrictions |
|Secure | SQL Injection|
| Appropriate with small project | Appropriate with complex project |

>## 3. Schema

### What is a Schema ?

A schema is a JSON object that defines the the structure and contents of your data.

Schemas represent types of data rather than specific values.

### Why define a Schema ?

Schemas are the specification for your application's data model. Once you've defined a schema, App Services provides you with additional tools and services to work with data that conforms to the schema.

App Services uses schemas in many application services:

* Atlas Device Sync uses schemas to sync data between realms and MongoDB Atlas. App Services can also generate idiomatic SDK object models for you based on your schemas.

* The GraphQL API uses schemas to automatically generate a GraphQL schema including types, queries, and mutations. You can extend your app's API with custom resolvers that reference the types defined by your schemas.

* Data Access Rules validate that data conforms to your schema before and after every request. If any document fails validation, App Services prevents or rolls back the entire request.

### Define a Schema

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

### Relationships

A relationship is a connection between two documents. Relationships allow you to reference and query related documents in read and write operations, even if the documents are in separate databases or collections.

Relationships are unidirectional and don't enforce uniqueness or other foreign key constraints. If you reference a non-existent foreign value in a source field, App Services automatically omits the reference from resolved relationships.

### To-One relationship

A to-one relationship links each source document with either a single document or an array of documents from the foreign collection.

### To-Many relationship

A to-many relationship links each source document with a list of documents from the foreign collection.


>## Type of MongoDB

MongoDB is a NoSQL document database. This mean MongoDB store data as documents