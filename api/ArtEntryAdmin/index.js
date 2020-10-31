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

    // DELETE an art entry
    if (req.method === "DELETE")
    {
        // First check that the entity is cleaned up from table storage
        var task = {
            PartitionKey: {'_': core.tableStoragePartitionKey},
            RowKey: {'_': rowKey}
        };

        var deleteResponse = await core.deleteEntity(tableSvc, core.tableStorageName, task);
        if (deleteResponse !== null && !deleteResponse.isSuccessful)
        {
            context.res = {status: 500};
            return;
        }

        // Second, clear out the blob storage. Try both supported image types
        var matchingBlobs = [];
        for await (const blob of containerClient.listBlobsFlat({prefix: rowKey})) {
            matchingBlobs.push(blob.name);
        }

        for (var i = 0; i < matchingBlobs.length; i++)
        {
            await containerClient.deleteBlob(matchingBlobs[i]);
        }

        return;
    }
};
