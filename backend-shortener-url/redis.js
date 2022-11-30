import Redis from 'ioredis';

const clientRedis = new Redis();

clientRedis.on('connect', () => console.log('Connected'));

async function keys(key) {
  let cursor = 0;
  let result = [];
  do {
    const resultOfScan = await clientRedis.scan(cursor, 'MATCH', key, 'COUNT', '10');
    cursor = resultOfScan[0];
    result = result.concat(resultOfScan[1]);
  } while (cursor !== '0');
  console.log(result);
  return result;
}

// clientRedis.set('book1:shelf1', '1');
// clientRedis.set('book2:shelf2', '1');
// clientRedis.set('book3:shelf1', '1');
// clientRedis.set('book4:shelf3', '1');
// clientRedis.set('book1:shelf2', '1');

// find book1 in all shelves
keys('book1:shelf?');

// find shelf1 have all books
keys('book?:shelf1');
