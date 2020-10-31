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

    // List the entities that exist
    // GET /art
    if (req.method === "GET")
    {
        const query = new azure.TableQuery().where('PartitionKey eq ?', core.tableStoragePartitionKey);
        var tableStorageResult = await core.queryEntities(tableSvc, core.tableStorageName, query, null);
        var apiObjectEntities = [];
        for(var i = 0; i < tableStorageResult.entries.length; i++) {
            apiObjectEntities.push(core.convertTableObjectToApiObject(tableStorageResult.entries[i], storageAccountName));
        }

        context.res = { body : apiObjectEntities };
        return;
    }

    // Add an art entity
    // PUT /art
    if (req.method == "PUT")
    {
        var bodyBuffer = Buffer.from(req.body);
        var boundary = core.getBoundary(req.headers['content-type']);
        var parts = core.parse(bodyBuffer, boundary);
        if (parts == null || parts === undefined || parts.length <= 0)
        {
            context.res = { status: 400, body: "Form parts were undefined" }
            return;
        }

        var artName = core.defaultArtName;
        var artist = core.defaultArtist;
        var curator = core.defaultCurator;
        var curatorNotes = core.defaultCuratorNotes;

        var imagesToUpload = [];
        for(var i = 0; i < parts.length; i++) {
            if (parts[i].type == 'image/jpeg') {
                parts[i].fileExtension = 'jpg';
                imagesToUpload.push(parts[i]);
            }
            else if (parts[i].type == 'image/png')
            {
                parts[i].fileExtension = 'png';
                imagesToUpload.push(parts[i]);
            }
            else if (parts[i].type === '')
            {
                // No file type, must be text records
                if (parts[i].name === core.formArtName)
                {
                    artName = parts[i].data.toString('utf8');
                }
                else if (parts[i].name === core.formArtistName)
                {
                    artist = parts[i].data.toString('utf8');
                }
                else if (parts[i].name === core.formCuratorName)
                {
                    curator = parts[i].data.toString('utf8');
                }
                else if (parts[i].name === core.formCuratorNotes)
                {
                    curatorNotes = parts[i].data.toString('utf8');
                }
            }
        }

        if (imagesToUpload.length != 1)
        {
            context.res = { status: 400, body: "This api only supports exactly one jpeg or png image at a time." }
            return;
        }

        var imageToUpload = imagesToUpload[0];
        imageToUpload.artName = artName;
        imageToUpload.artist = artist;
        imageToUpload.curator = curator;
        imageToUpload.curatorNotes = curatorNotes;

        const blobId = uuidv1();
        const blockBlobClient = containerClient.getBlockBlobClient(blobId + "." + imageToUpload.fileExtension);
        const uploadBlobResponse = await blockBlobClient.upload(imageToUpload.data, imageToUpload.data.length);

        var tableEntry = {
            PartitionKey: {'_': core.tableStoragePartitionKey},
            RowKey: {'_': blobId},
            name: {'_': imageToUpload.artName},
            artist: {'_': imageToUpload.artist},
            curator: {'_': imageToUpload.curator},
            curatorNotes: {'_': imageToUpload.curatorNotes},
            fileExtension: {'_': imageToUpload.fileExtension}
        };
        
        var tableResult = await core.insertEntity(tableSvc, core.tableStorageName, tableEntry, function(error, result, response){
            if(!error) {
                console.log(result);
            }
        });

        tableEntry.Timestamp = {'_': new Date().toISOString()}; // add the timestamp so processing works the same
        context.res = { body : core.convertTableObjectToApiObject(tableEntry, storageAccountName) };
        return;
    }

    // TODO: future
    // Delete an existing entity
    // DELETE /art/{artId}

    // Update an art entity's metadata
    // POST /art/{artId}
};
