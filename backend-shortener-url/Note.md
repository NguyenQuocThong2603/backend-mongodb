# Note

## Faster Mongoose Queries With Lean

Lean option sẽ làm Mongoose bỏ qua các bước gắn thêm vào docment. Lean option sẽ làm cho query nhanh hon và đỡ tốn memory hơn nhưng document trả về sẽ là một plain old JavaScript Objects (POJOs) không phải Mongoose document.

Thông thường, khi mà thực hiện xong 1 câu query, Mongoose sẽ convert kết quả câu query từ POJOs sang Mongoose document. Nếu bật lean option, Mongoose sẽ bỏ qua bước này

Nhược điểm của việc kích hoạt tinh gọn là các tài liệu tinh gọn không có:

* Change tracking
* Casting and validation
* Getters and setters
* Virtuals
* `save()`

### Lean and Populate

Populate có thể sử dụng với lean. Khi sử dụng lean, populated document cũng sẽ bị ảnh hưởng.

### When to use Lean

Sử dụng lean với `GET`

## Session

Session dùng để chứa các thông tin unique về client để cho phép server có thể theo dõi trạng thái của user.

### How Session works

Khi mà người dùng đăng nhập login, server sẽ tạo 1 `session` và lưu trữ session đó ở phía server. Khi mà server phản hồi lại cho người dùng, server sẽ gửi một `cookie`. `Cookie` này sẽ chứa unique id được lưu ở phía server. `Cookie` này sẽ được đính kèm theo mọi request đến server.

Chúng ta sẽ sử dụng session id này để so sánh với session được lưu trong database hoặc nơi chứa session.
