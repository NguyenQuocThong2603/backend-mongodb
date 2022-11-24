import Redis from 'ioredis';

const clientRedis = new Redis('redis://default:Bin0904411741@redis-14410.c1.ap-southeast-1-1.ec2.cloud.redislabs.com:14410');

clientRedis.on('connect', () => console.log('Connected'));

function getAvailable(seatMap) {
  const seats = [];
  const endSeat = seatMap.bit;
}
