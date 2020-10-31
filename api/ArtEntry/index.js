const { BlobServiceClient } = require('@azure/storage-blob');
const uuidv1 = require('uuid/v1');
const azure = require('azure-storage');
const core = require('../core');

module.exports = async function (context, req) {
    var storageAccountName = process.env["ArtStorageAccount"]; // these can be defined in either app settings in the cloud, or through the local.settings.json file
    var storageAccountKey = process.env["ArtStorageAccountKey"];

    const blobServiceClient = await BlobServiceClient.fromConnectionString("DefaultEndpointsProtocol=https;AccountName=" + storageAccountName + ";AccountKey=" + storageAccountKey + ";EndpointSuffix=core.windows.net");
    const containerClient = await blobServiceClient.getContainerClient(core.blobContainer);
    const tableSvc = azure.createTableService(storageAccountName, storageAccountKey);

    // // Some initialization code that is not needed unless the container or storage table is deleted
    // // Commenting it out for now to avoid extra http calls on every request
    // await createTableIfNotExists(tableSvc, 'artMetadata', function(error, result, response){});
    // if (!(await containerClient.exists()))
    // {
    //     await containerClient.create();
    // }

    var rowKey = context.bindingData.entryId;

    // List the entities that exist
    // GET /art
    if (req.method === "GET")
    {
        var correspondingEntry = await core.retrieveEntity(tableSvc, core.tableStorageName, core.tableStoragePartitionKey, rowKey);
        if (correspondingEntry === null)
        {
            context.res = { status : 404 };
            return;
        }
        
        var apiObj = core.convertTableObjectToApiObject(correspondingEntry, storageAccountName);
        context.res = { body : apiObj };
        return;
    }

    // TODO: future
    // Delete an existing entity
    // DELETE /art/{artId}

    // Update an art entity's metadata
    // POST /art/{artId}
};
