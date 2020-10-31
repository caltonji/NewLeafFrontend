var azure = require('azure-storage');

// setup init structure
// tableSvc.createTableIfNotExists('user', function(error, result, response) {
exports.saveUser = function(user, callback) {
    var storageAccountName = process.env["ArtStorageAccount"]; // these can be defined in either app settings in the cloud, or through the local.settings.json file
    var storageAccountKey = process.env["ArtStorageAccountKey"];
    const tableSvc = azure.createTableService(storageAccountName, storageAccountKey);
    tableSvc.insertEntity('user', createEntityFromUser(user), { echoContent: true }, function (error, result, response) {
        if(!error){
            callback(createUserFromEntity(result));
        }
    });
}

function createUserFromEntity(entity) {
    var user = {};
    user.partitionId = entity.partitionKey._;
    user.shortId = entity.RowKey._;
    user.name = entity.name._;
    user.phoneNumber = entity.phoneNumber._;
    return user
}

function createEntityFromUser(user) {
    console.log(user);
    var userEnt = {
        PartitionKey: { "_": user.partitionId },
        RowKey: { "_": user.shortId },
        phoneNumber: {"_": user.phoneNumber },
        name: {"_": user.name },
    };
    console.log(userEnt);
    return userEnt;
}