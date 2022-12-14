# GraphQL

## Schema

Schema là một tập hợp của các **object type** chứa các **field**.

Có các loại type:

* Int
* Float
* String
* Boolean
* ID
* Object

Cách declare type:

* Sử dụng keywork `type` theo sau là tên của type đó (PascalCase) và mở cặp ngoặc nhọn để chứa các field
* Field được declare bởi tên của field đó, dấu hai chấm

## Các bước sử lý của Apollo từ req -> res

Các bước: parse -> build ast -> validate -> resolve -> result

Đầu tiên, client sẽ gửi request dưới dạng string đã define các filed được chọn theo 1 trong 2 phương thức HTTP là `GET` hoặc `POST` về cho server.

Khi server nhận được request, server sẽ extract query string đó. Server sẽ parse và chuyển query string đó thành **AST**.

Với **AST** server sẽ validate query với các type và field ở trong Schema. Nếu có một type hoặc filed nào sai hoặc có field nào đó không được define trong schema,.. server sẽ gửi `Error` về cho app. Ngược lại nếu validate thành công, server sẽ thực hiện query. Server sẽ đi xuống theo cây **AST**, với mỗi field trong query, server sẽ gọi từng hàm resolver tương ứng với field đó. Nhiệm vụ của hàm resolver là lấy data từ database hoặc REST API

Khi mà đã lấy được data từ tất cả các filed, data sẽ được đưa vào JSON theo thứ tự client query.

Server sẽ gửi object thông qua HTTP body dưới key `data` về cho app.

## Resolver

Resolver một function có nhiệm vụ là đưa data vào trong 1 field của schema. Resolver có tên giống với field mà nó populate data. Resolver có thể fetch data từ bất cứ data source nào, sau đó chuyển data đó thành hình dạng mà client yêu cầu.

### Parent, Args, Context, Info trong resolver

**Parent**: là kết quả trả về của hàm resolver cha của field đó.

**Args**: Là một object chứa toàn bộ đối số của GraphQL mà được cung cấp cho field đó thông qua các GraphQL operation

**Context**: là một object được chia sẻ giữa các resolver dùng để thực hiện một số operation cụ thể nào đó.

**Info**: chứa thông tin về trạng thái thực hiện của operation bao gồm: tên của field đó, path tới field đó từ root,...

### Authentication

Authentication logic có thể được viết trong `context` property của `ApolloServer` constructor.

### Interface

Interface là một abstract type define một tập hợp các field chung cho một số type.

Sử dụng hàm `__resolve` để xử lý logic của việc trả về các type implement interface

### Query fragment

Fragment là một tập hợp con các field của một type mà có thể reuse và chia sẻ giữa các operation