var moment = require('moment');
var now = moment();

// print current timestamp
console.log(now.format());
// unix time in seconds
console.log(now.format('X'));
// unix time in miliseconds
console.log(now.format('x'));

console.log(now.valueOf('x'));

var timestamp = 1474560081;
var timestampMoment = moment.utc(timestamp);

console.log(timestampMoment.format('h:mm a'));

//console.log(now.format('MMM Do YYYY, h:mmA'));