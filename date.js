
exports.getDate = function(){
    const today = new Date();
const options = {
                 weekday:"long",
                 day:"numeric",
                 month:"long" 
}
 const day = today.toLocaleString("en-US",options );
  return day; 
}




// code refactoring
// module.exports.getDate=getDate;

//  var getDate =function (){                                                     //function getDate(){//rest of the code.....
//     let today = new Date();
// let options = {
//                  weekday:"long",
//                  day:"numeric",
//                  month:"long" 
// }
//  let day = today.toLocaleString("en-US",options );
//   return day; 
// }
