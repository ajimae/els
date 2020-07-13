var Token = require('../models/token');

function getResumetoken(id) {
  console.log("Getting resume token", {id})
  var result;
  Token.findOne({ "idr": id }, function(data) {
    result = JSON.parse(data);
  });
  
  return result ? result.resumeToken : null;
}

async function saveResumeTaken(resumeToken, id) {
  console.log("Saving resume token");
  await Token.findOneAndUpdate(
    {"idr": id},
    {"$set": { resumeToken: JSON.stringify(resumeToken) } },
    {"upsert": true}
  );
}

module.exports = {
  getResumetoken,
  saveResumeTaken
};
