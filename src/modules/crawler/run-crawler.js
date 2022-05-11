import Crawler from './crawler.js';

// https://google.com
// https://ya.ru
// http://localhost:3000/one
const result = await new Crawler('https://ya.ru', 2, 30).start();
console.log('-----', 'result', result);
console.log('-----', 'end');
