# Note

## Indexes

Indexes là một cấu trúc dữ liệu dùng để cải thiện performance, hỗ trọ tìm kiếm match và range hiệu quả, và có thể dùng để sort kết quả. Indexes được tạo ra chỉ để return data mà người dùng yêu cầu, không phải scan từng document trong collection

Cơ chế sort bình thừong, la se lay document tu disk chuyen qua RAM va sort tren RAM

## Compound indexes

Đánh index trên multiple field

Hỗ trợ support các câu lệnh query trùng với prefix của index fields.

Ta co the dung index de sort.

Đối với compound indexes, thứ tự các field rất quan trọng

## Multikey indexes

Sử dụng cho Array

Chỉ có 1 multikey indexes cho 1 collection

Multikey indexes cần fetch lại documents sau giai đoạn index scan bởi vì index của các phần tử trong mảng được lưu độc lập

## Test Indexes

Tra ve ket qua giong voi 1 trong cac tu duoc tim kiem. De tra ve ket qua gan giong nhat voi cac tu duoc tim kiem ta them `$meta: textScore` va sort tren `$meta: textScore`

## Populate

Populate dùng để reference các documents trong các collection khác. Population là quá trình tự động thay đường dẫn trong một document thành một hoặc nhiều document từ các collection khác.

Transform trong populate dùng để thay đổi các tài liệu.

## JSON và JS Object

### JSON

JSON là định dạng nhẹ dùng để lưu trữ và trao đổi dữ liệu. Được sử dụng cho nhiều ngôn ngữ khác nhau.

### JS Object

Object là một kiễu dữ liệu trong JS. Chỉ được sử dụng trong JS.

### Điểm khác nhau giữa JSON và JS Object

|JSON| Object|
|----|-------|
|Dùng để lưu trữ và trao đổi dữ liệu | Dùng để tạo ra một object trong JS|
|Các thuộc tính phải nằm trong dấu ""| Các thuộc tính không cần ""|

## ObjectID trong MongoDB

Dùng như một primary key.

Mỗi ObjectID là độc nhất.

ObjectID được tạo ra tự động bởi MongoDB nếu chúng ta không tạo thuộc tính `_id` trong Schema

ObjectID bao gồm 12 byte. 4 byte đầu là Unix timestamp lưu dưới dạng giây ngay lúc tạo document, 5 byte sau là 1 số random và số random này là độc nhất cho mỗi máy và tiến trình. 3 byte tiếp theo là một số tự tăng được khởi tạo bằng 1 số ngẫu nhiên.

## Schema

Schema không chỉ xác định cấu trúc của document và cast các thuộc tính, Schema còn có thể định nghĩa các method (instance, static), các virtual, các alias, các compound indexes và middleware.

## Aggregation

Aggregate
