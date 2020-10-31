const storageOperations = require('../v2/storageOperations');

// Create User (and send welcome text)
// req body:
//   name: string 
//   partitionId: string
//   phoneNumber: string
// return value with have shortId: string
module.exports = async function (context, req) {
    console.log(req);
    console.log(context);
    if (!req.body.name || !req.body.phoneNumber || !req.body.partitionId) {
        context.res = { status: 400, body: "Missing required fields." }
        return;
    }

    storageOperations.saveUser(parseUser(req), function(createdUser) {
        // await twilioOperations.welcomeUser(createdUser);
        context.res = buildResponse(createdUser);
    });

    
};

// Helper Functions:
// --------------------------------------------------------------------
function parseUser(req) {
    user = {
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        shortId: createNewShortId(),
        partitionId: req.body.partitionId
    }
    return user;
}
function createNewShortId() {
    var idLength         = 4;
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    for ( var i = 0; i < idLength; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function buildResponse(user) {
    return { body : user };
}