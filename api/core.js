// API Constants
exports.defaultArtName = "Unknown";
exports.defaultArtist = "Unknown";
exports.defaultCurator= "Unknown";
exports.defaultCuratorNotes= "A fine piece indeed!";

exports.formArtName = "artName";
exports.formArtistName = "artistName";
exports.formCuratorName = "curatorName";
exports.formCuratorNotes = "curatorNotes";

// Storage Constants
exports.blobContainer = "public";

exports.convertTableObjectToApiObject = function(tableStorageObject, azureStorageAccountName)
{
    var apiObject = {};
    apiObject.id = tableStorageObject.RowKey._;
    apiObject.lastModifiedOn = tableStorageObject.Timestamp._;
    apiObject.name = tableStorageObject.name._;
    apiObject.artist = tableStorageObject.artist._;
    apiObject.curator = tableStorageObject.curator._;
    apiObject.curatorNotes = tableStorageObject.curatorNotes._;
    var fileExtension = tableStorageObject.fileExtension._;
    apiObject.blobUri = "https://" + azureStorageAccountName + ".blob.core.windows.net/" + exports.blobContainer + "/" + apiObject.id + "." + fileExtension;
    return apiObject;
};

// Table Storage Constants
exports.tableStorageName = "artMetadata";
exports.tableStoragePartitionKey = "id";

// MISC Helpers
exports.asyncForEach = async function(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}

// Table Storage Wrappers
exports.retrieveEntity = async function(tableService, ...args) {
    return new Promise((resolve, reject) => {
        let promiseHandling = (err, result) => {
            if (err) {
				if (err.code === "ResourceNotFound")
				{
					resolve(null);
					return;
				}

                reject(err);
            } else {
                resolve(result);
            }
        };
        args.push(promiseHandling);
        tableService.retrieveEntity.apply(tableService, args);
    });
};

exports.queryEntities = async function(tableService, ...args) {
    return new Promise((resolve, reject) => {
        let promiseHandling = (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        };
        args.push(promiseHandling);
        tableService.queryEntities.apply(tableService, args);
    });
};

exports.createTableIfNotExists = async function(tableService, ...args) {
    return new Promise((resolve, reject) => {
        let promiseHandling = (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        };
        args.push(promiseHandling);
        tableService.createTableIfNotExists.apply(tableService, args);
    });
};

exports.insertEntity = async function(tableService, ...args) {
    return new Promise((resolve, reject) => {
        let promiseHandling = (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        };
        args.push(promiseHandling);
        tableService.insertEntity.apply(tableService, args);
    });
};

exports.deleteEntity = async function(tableService, ...args) {
    return new Promise((resolve, reject) => {
        let promiseHandling = (err, result) => {
            if (err) {
				if (err.code === "ResourceNotFound")
				{
					resolve(null);
					return;
				}
				
                reject(err);
            } else {
                resolve(result);
            }
        };
        args.push(promiseHandling);
        tableService.deleteEntity.apply(tableService, args);
    });
};

// Multipart parsing
exports.getBoundary = function(header){
	var items = header.split(';');
	if(items)
		for(i=0;i<items.length;i++){
			var item = (new String(items[i])).trim();
			if(item.indexOf('boundary') >= 0){
				var k = item.split('=');
				return (new String(k[1])).trim();
			}
		}
	return "";
}

exports.parse = function(multipartBodyBuffer,boundary){
	var process = function(part){
		// will transform this object:
		// { header: 'Content-Disposition: form-data; name="uploads[]"; filename="A.txt"',
		//	 info: 'Content-Type: text/plain',
		//	 part: 'AAAABBBB' }
		// into this one:
		// { filename: 'A.txt', type: 'text/plain', data: <Buffer 41 41 41 41 42 42 42 42> }
		var obj = function(str){
			var k = str.split('=');
			var a = k[0].trim();
			var b = JSON.parse(k[1].trim());
			var o = {};
			Object.defineProperty( o , a , 
			{ value: b, writable: true, enumerable: true, configurable: true })
			return o;
        }
        // Content-Disposition: form-data; name="rando"
        var headerSplit = part.header.split(';');
        var fileName = "";
        if (headerSplit.length > 1)
        {
            fileName = headerSplit.length == 2 ? headerSplit[1] : headerSplit[2];
        }

        var file = obj(fileName);
        
        Object.defineProperty( file , 'data' , 
            { value: new Buffer(part.part), writable: true, enumerable: true, configurable: true })

        var partInfoSplit = part.info.split(':');
        var contentType = "";
        if (partInfoSplit.length > 1)
        {
            contentType = part.info.split(':')[1].trim();
        }
	
		Object.defineProperty( file , 'type' , 
			{ value: contentType, writable: true, enumerable: true, configurable: true })
		
		return file;
	}
	var prev = null;
	var lastline='';
	var header = '';
	var info = ''; var state=0; var buffer=[];
	var allParts = [];

	for(i=0;i<multipartBodyBuffer.length;i++){
		var oneByte = multipartBodyBuffer[i];
		var prevByte = i > 0 ? multipartBodyBuffer[i-1] : null;
		var newLineDetected = ((oneByte == 0x0a) && (prevByte == 0x0d)) ? true : false;
		var newLineChar = ((oneByte == 0x0a) || (oneByte == 0x0d)) ? true : false;

		if(!newLineChar)
			lastline += String.fromCharCode(oneByte);

		if((0 == state) && newLineDetected){
			if(("--"+boundary) == lastline){
				state=1;
			}
			lastline='';
		}else
		if((1 == state) && newLineDetected){
			header = lastline;
			state=2;
			lastline='';
		}else
		if((2 == state) && newLineDetected){
			info = lastline;
            state=3;
            if (info === '')
            {
                // info is optional, skip to state 4 if this is empty
                buffer=[];
                state=4;
            }

			lastline='';
		}else
		if((3 == state) && newLineDetected){
			state=4;
			buffer=[];
			lastline='';
		}else
		if(4 == state){
			if(lastline.length > (boundary.length+4)) lastline=''; // mem save
			if(((("--"+boundary) == lastline))){
				var j = buffer.length - lastline.length;
				var part = buffer.slice(0,j-1);
				var p = { header : header , info : info , part : part  };
				allParts.push(process(p));
				buffer = []; lastline=''; state=5; header=''; info='';
			}else{
				buffer.push(oneByte);
			}
			if(newLineDetected) lastline='';
		}else
		if(5==state){
			if(newLineDetected)
				state=1;
		}
	}
	return allParts;
};