# Table of Contents

>## 1. What is an ORM ?

ORM là 1 kỹ thuật lập trình giúp ánh xạ các record dữ liệu trong hệ quản trị cơ sở dữ liệu sang dạng đối tượng đang định nghĩa trong các class

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

