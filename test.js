console.log(new Date('Wed Jul 13 2022 11:45:00 GMT+0200 (Central European Summer Time)').getTime() === new Date().getTime());
const curr = new Date();
const chec = new Date('7/13/2022, 11:45:00 AM');
const diffTime = Math.abs(curr.getTime(), chec.getTime());
console.log(curr.getTime());
console.log(chec.getTime());
if (curr.getTime()>chec.getTime()){
    console.log("Run!")
}
else {
    console.log("wait")
}
console.log(diffTime);