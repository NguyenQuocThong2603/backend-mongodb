# Quiz 5

## Câu 2: Schema là gì và có thể làm gì ?

Schema được dùng như một cấu trúc cho dữ liệu.

Schema không chỉ xác định cấu trúc của document và cast các thuộc tính, Schema còn có thể định nghĩa các method (instance, static), các virtual, các alias, các compound indexes và middleware.

## Câu 3: Object ID là gì ? Có bao nhiêu byte và thành phần của Object ID

Dùng như một primary key.

Mỗi ObjectID là độc nhất.

ObjectID được tạo ra tự động bởi MongoDB nếu chúng ta không tạo thuộc tính `_id` trong Schema

ObjectID bao gồm 12 byte. 4 byte đầu là Unix timestamp lưu dưới dạng giây ngay lúc tạo document, 5 byte sau là 1 số random và số random này là độc nhất cho mỗi máy và tiến trình. 3 byte tiếp theo là một số tự tăng được khởi tạo bằng 1 số ngẫu nhiên.

## Câu 4: So sánh SQL và NoSQl

|NoSQL| SQL|
|-----|-----|
|A NoSQL database has dynamic schema for unstructured data| SQL requires you to use predefined schemas to determine the structure of your data before you work with it.|
| NoSQL databases are horizontally scalable. This means that you handle more traffic by sharding, or adding more servers in your NoSQL database | In almost all situations SQL databases are vertically scalable. This means that you can increase the load on a single server by increasing things like RAM, CPU or SSD.|
| These databases are best suited for hierarchical data storage.| These databases are not suited for hierarchical data storage.|
| Follows CAP(consistency, availability, partition tolerance) |Follows ACID property|

Tên NoSQL được đặt là do data không phải dạng bảng (tabular)

## Câu 5: Table là gì và Row là gì trong MongoDB

Table là collection trong MongoDB. Row là document trong MongoDB

## Câu 6: Populate là gì ?

Populate dùng để reference các documents trong các collection khác. Population là quá trình tự động thay đường dẫn trong một document thành một hoặc nhiều document từ các collection khác.

## Câu 7: Design quan hệ 1:1, 1:many, many:many như thế nào

Quan hệ 1:1: gồm các thuộc tính có liên quan đến nhau thành 1 bảng. Có 2 cách là Embed và Reference:

* Embed: tập hợp các thuộc tính lại vói nhau trong 1 document hoặc trong 1 sub-document (simplicity)
* Reference: có thể chia các thuộc tính thành nhiều documents khác nhau, thường là ở trong các collection khác nhau và tạo reference từ document này qua document khác (optimization)

Quan hệ 1:many: Có 2 cách là Embed và Reference:

* Embed: có thể tạo embed từ phía "one" hoặc từ phía "many" (các document có thể bị duplicated). Thường là tạo trong đối tượng được query nhiều nhất. Tạo embed document của phía "one" trong phía "many" (chỉ các thuộc tính mình cần)
* Reference: tạo link từ phía "one" hoặc từ phía "many". Thường là tạo reference ở phía "many"

Quan hệ many:many: Cũng có 2 cách là Embed và Reference:

* Embed: tạo mảng embedded document ở 1 trong 2 phía. Thường là phía được query nhiều hơn.
* Reference:

## Câu 8

```js
db.users.aggregate([
  {
    $match: {
      departments: 'SW'
    }
  }
])
```

## Câu 9

```js
db.users.aggregate([
  {
    $match: {
      departments: {$size: {$gt: 1}}
    }
  }
])
```

## Câu 10: Aggregate là gì ? So sánh aggregate và populate

Aggregate là quy trình truy vấn data thông qua nhiều các stage khác nhau.
