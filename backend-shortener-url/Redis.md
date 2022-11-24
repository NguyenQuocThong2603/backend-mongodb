# Redis

Redis là một `open-source` lưu trữ dữ liệu dưới dạng `key-value`

Key Features của redict:

* Data được lưu trữ dưới dạng key-value
* Có thể set expired time cho data
* In memory

## Performance

Tất cả dữ liệu của Redis được chưa trên bộ nhớ, cho nên có thể cung cấp việc truy cập dữ liệu lớn vói độ trễ thấp.

Việc lưu trữ dữ liệu không cần phải truy cập đĩa, cho nến giảm độ trễ xuống chỉ còn vài microseconds

## Flexible data structures

* Strings – văn bản hoặc mã nhị phân có thể lên đến 512B
* Lists – một linked list các String theo thứ tự được thêm vào
* Sets – một collection không có thứ tự của các unique string
* Sorted Sets – một collection các unique string được sắp xếp theo điểm.
* Hashes – cấu trúc dữ liệu được dùng để lưu trữ các key và value
* Bitmaps – a data type that offers bit level operations
* HyperLogLogs – a probabilistic data structure to estimate the unique items in a data set
* Streams - một cấu trúc log dữ liệu Message queue
* Geospatial - a longitude-/latitude-based entries Maps, "nearby"
* JSON

## Replication and persistence

Redis hỗ trợ việc replicate data cho nhiều server. Nhờ đó có thể tăng performance của việc đọc dữ liệu và hồi phục nhanh chóng khi mà server chính gặp lỗi ngưng hoạt động.

Redis hỗ trợ việc back-up tại một thời điểm.

## Data Types

### String

String lưu trữ chuỗi các byte bao gồm text, serialized object và binary array.

**Commands:**

* `SET` dùng để set key value. Syntax: SET "key" "value"

* `SETNX` dùng để set key value nếu key đó chưa tồn tại.

* `GET` dùng để lấy value của key đó. Syntax: GET "key"

### Lists

Redis list là linked list các string.

**Commands:**

* `LPUSH`: thêm một phần tử vào đầu list, `RPUSH` thêm phần tử vào cuối list. Syntax: LPUSH "list" "value"

* `LPOP`: xóa và return phần tử ở đầu list, `RPOP` xóa và return phần tử ở cuối list. Syntax: LPOP "list"

* `LLEN`: return độ dài của list. Syntax: LLEN "list"

* `LRANGE`: return các phần tử theo key từ vị trí start đến vị trí end. Syntax: LRANGE "list" "start" "end"

* `LMOVE`: tự động chuyển 1 phần tử ở đầu hoặc cuối list này qua đầu hoặc cuối list khác. Syntax: LMOVE mylist myotherlist RIGHT LEFT (xóa và lấy phần tử cuối của `mylist` thêm vào đầu của `myotherlist`)

* `LTRIM`: cắt list để nó chỉ có những phần tử được chỉ định. Syntax: LTRIM mylist 0 99 (lấy phần tử 0 đến 99 của mylist, các phần tử từ 100 trở đi bị loại bỏ)

### Sets

Set là một tập hợp không có thứ tự của các unique string

**Command**:

* `SADD`: thêm một member vào trong set. Syntax: SADD "Set" "member".

* `SREM`: xóa một member ra khỏi set. Syntax: SREM "Set" "member"

* `SISMEMBER`: kiểm tra xem string này có phải là member của set hay không. Syntax: SISMEMBER "Set" "member"

* `SINTER`: return các member nằm trong 2 hoặc nhiều set. Syntax: SINTER "Set1" "Set2" ...

* `SCARD`: return size của set. Syntax: SCARD "Set"

### Hashes

Redis hashes là một cấu trúc dữ liệu nhiều các cặp field value

**Commands:**

* `HSET`: set value của 1 hoặc nhiều field của hash. Syntax: HSET "Hash" field1 value1 field2 value2 ...

* `HGET`: return value của một field. Syntax: HGET "Hash" field

* `HGETALL`: return tất cả field. Syntax: HGETALL "Hash"

* `HDEL`: xóa 1 field. Syntax: HDEL "Hash" field

### Sorted Sets

Sorted Set là một tập hợp của các unique string theo thứ tự của một điểm số liên quan. Khi mà hơn một string có cùng điểm số, các string đó sẽ được sắp xếp theo thứ tự từ điển.

Sorted Set có position

**Commands:**

* `ZADD`: add một member và điểm số vào sorted set. Nếu member đã tồn tại, điểm số sẽ được update. Syntax: ZADD "Sorted Set" "score" "member"
* `ZRANGE`: return các member của sorted set, sort với range đã cho. Syntax: ZRANGE "Sorted Set" "member" "start" "stop". Có thể thêm REV (reverse) và WITHSCORES dùng để hiện điểm của người dùng.
* `ZRANK`: return rank của member, theo tứ tự tăng dần. Syntax: ZRANK "Sorted Set" "member"
* `ZREMRANGEBYRANK`: xóa bỏ các phần tử theo rank. Syntax: ZREMRANGEBYRANK "Sorted Set" "start" "stop"
* `ZINTERSTORE`: intersection set và sorted set. Syntax: ZINTERSTORE "destination" "numkeys" "sorted set" "set" "weights"

### Bitmaps

Là một chuỗi string dưới dạng bit

**Commands:**

* `SETBIT`: set bit của chuỗi được cung cấp là 0 hoặc 1. Syntax: SETBIT "key" "offset" "value"
* `GETBIT`: return value của bit tại offset đã cho. Syntax: GETBIT "key" "offset"
* `BITCOUNT`: return số bit 1 của key đó. Syntax: BITCOUNT "key"

### Geospatial

Redis geospatial dùng để lưu trữ tọa độ và tìm kiếm chúng.

GeoHashes được lưu trong sorted set

**Commands:**

* `GEOADD`: thêm 1 vị trí vào gaospatial index. Syntax: GEOADD "geospatial" "longitude" "latitude" "member"
* `GEOSEARCH`: return các vị trí trong một giới hạn hoặc bán kính nhất định. Syntax: GEOSEARCh "geospatial" \<FROMMEMBER member | FROMLONLAT longitude latitude> \<BYRADIUS radius <M | KM | FT | MI> | BYBOX width height \<M | KM |FT | MI>> [ASC | DESC] [COUNT count [ANY]] [WITHCOORD] [WITHDIST] [WITHHASH]
* `GEORADIUS`: return member của sorted set liên quan đến geospatial này. Syntax: GEORADIUS "key" "longitude" "latitude" "radius" \<M | KM | FT | MI> [WITHCOORD] [WITHDIST] [WITHHASH] [COUNT count [ANY]] [ASC | DESC] [STORE key] [STOREDIST key]

## Faceted Search

Faceted search là một kỹ thuật dùng để điều hướng phân loại bằng cách sử dụng nhiều filter và tiêu chí

## Keyspace notifications

Dùng để theo dõi một object và nhận thông báo khi object đó được thay đổi

`WATCH` dùng để theo dõi một object. `WATCH` thường nằm trước 1 transaction. Nếu object được `WATCH` trong transaction đó bị thay đổi bởi client khác, khi transaction `EXEC` sẽ bị lỗi.

## Pub / Sub

**Commands:**

* `PUBLISH`: publish message lên channel. Syntax: PUBLISH "channel" "message"
* `SUBSCRIBE`: subscribe vào 1 hoặc nhiều channel. Syntax: SUBSCRIBE "channel"
* `UNSUBSCRIBE`: unsubscribe 1 hoặc nhiều channel. Syntax: UNSUBSCRIBE "channel"
* `PUBSUB`: dùng để theo dõi hệ thống pub/sub. Syntax: PUBSUB: subcommand. Subcommand:
  * CHANNELS: trả về list các channel đang active
  * NUMSUB "channel": return số client đang subscribe channel đó
  * NUMPAT: return số pattern subscriber và số pattern

## Lua

Lua là một scripting language.

**Tại sao phải sử dụng Lua với Redis:**

* Lua sẽ wrap redis commands lại
* Lua cung cấp khả năng thao tác vói nhiều key bên trong quy trình của database mà không cần phải truyền thông tin qua lại network. Giúp giảm lưu lượng mạng
* Atomic unit of work

**Commands:**

* `EVAL`: chạy Lua script. Syntax: EVAL "script" "numbers" "agrs"
* `SCRIPT LOAD`: load Lua script vào redis. Syntax: SCRIPT LOAD "script"
* `EVALSHA`: chạy lua script nhưng theo sha của lua đó. Syntax: EVALSHA "sha" "numbers" "agrs"

**Rule:**

* Array bắt đầu từ số 1
* Key nên được truyền vào, không nên hard code
* Float sẽ bị chuyển thành int dẫn đến thiếu chính xác. Nên để dạng string.
