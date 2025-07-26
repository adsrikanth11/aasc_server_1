// Generate unique application id
function generateApplicationId() {
   const prefix = "AASC";
   const timestamp = Date.now(); // milliseconds since epoch
   const randomNum = Math.floor(Math.random() * 10000); // 4 digit random
   return `${prefix}_${timestamp}_${randomNum}`;
}

module.exports = generateApplicationId;