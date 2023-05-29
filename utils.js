// Generate storage in the disk
const generateStorage = (dirName) => {
	return multer.diskStorage({
	  destination: function (req, file, cb) {
		cb(null, `./uploads/${dirName}`);
	  },
	  filename: async function (req, file, cb) {
		const today = new Date();
		const yyyy = today.getFullYear();
		let mm = today.getMonth() + 1; // Months start at 0!
		let dd = today.getDate();
		const pathToCheck =
		  dirName + "-" + dd + "-" + mm + "-" + yyyy + "-" + v4() + path.extname(file.originalname);
		cb(null, pathToCheck);
	  },
	});
  };
  
  //Generate filter for file size and type
  const generateFilter = (allowedFileSize, allowedFileTypes) => (req, file, callback) => {
	const acceptableExtensions = allowedFileTypes;
	const mime = file.mimetype;
	if (!acceptableExtensions.includes(mime)) {
	  return callback({ code: "LIMIT_FILE_TYPE" });
	}
  
	const fileSize = parseInt(req.headers["content-length"]);
	if (fileSize > allowedFileSize) {
	  return callback({ code: "LIMIT_FILE_SIZE_50" });
	}
  
	callback(null, true);
  };
  
  export const uploadAttachment = multer({
	storage: generateStorage(UPLOAD_DIRECTORIES.EDITOR),
	// fileFilter,
  });


//Algorithm for data encryption and decryption
const key = String(envs.encryptSecretKey);
const iv = key.substring(0, 16);
const keyBuffer = Buffer.from(key, "utf-8");
const ivBuffer = Buffer.from(iv, "utf-8");

// Get algorythm type
const getAlgorithm = (keyBase) => {
  let key = Buffer.from(keyBase, "base64");
  switch (key.length) {
    case 16:
      return "aes-128-cbc";
    case 32:
      return "aes-256-cbc";
  }
  throw new Error("Invalid key length: " + key.length);
};

// Encypt data
export const encryptData = (text) => {
  if (!text) return text;
  try {
    const cipher = crypto.createCipheriv(getAlgorithm(keyBuffer), keyBuffer, ivBuffer);
    let encrypted = cipher.update(text, "utf-8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
  } catch (e) {
    //return text;
    return "";
  }
};

//Decrypt data
export const decryptData = (text) => {
  if (!text) return text;
  try {
    const decipher = crypto.createDecipheriv(getAlgorithm(keyBuffer), keyBuffer, ivBuffer);
    let decrypted = decipher.update(text, "base64", "utf-8");
    decrypted += decipher.final();
    return decrypted;
  } catch (e) {
    //return text;
    return "";
  }
};

// Create log files
export const createLogFile = async (fileName, fileData) => {
	let obj = {
	  logs: [],
	};
	fs.readFile(fileName, "utf8", function readFileCallback(err, data) {
	  if (err) {
		obj.logs.push(fileData);
		const json = JSON.stringify(obj);
		fs.writeFile(fileName, json, "utf8", function (err) {
		  if (err) {
			console.log(err);
		  }
		});
	  } else {
		obj = JSON.parse(data); //now it an object
		obj.logs.push(fileData); //add some data
		const json = JSON.stringify(obj); //convert it back to json
		fs.writeFile(fileName, json, "utf8", function (err) {
		  if (err) {
			console.log(err);
		  }
		});
	  }
	});
  };

  //Get path of file
  const getPath = (req, file, dir) => {
	if (!file) {
	  return null;
	}
  
	return `${req.protocol}://${req.headers.host}/uploads/${dir}/${file}`;
  };
  
  // Get path of file based on keys
  export const GET_FILE_URL = {
	diagnosis: (req, file) => {
	  return getPath(req, file, UPLOAD_DIRECTORIES.DIAGNOSIS);
	},
	smartFactory: (req, file) => {
	  return getPath(req, file, UPLOAD_DIRECTORIES.SMART_FACTORY);
	},
	smartDevice: (req, file) => {
	  return getPath(req, file, UPLOAD_DIRECTORIES.SMART_DEVICE);
	},
	supplierIntroduction: (req, file) => {
	  return getPath(req, file, UPLOAD_DIRECTORIES.SUPPLIER_INTRODUCTION);
	},
	supplycompanyImage: (req, file) => {
	  return getPath(req, file, UPLOAD_DIRECTORIES.COMPANY);
	},
  
	bestcompanyImage: (req, file) => {
	  return getPath(req, file, UPLOAD_DIRECTORIES.BEST_PRACTICE);
	},
	notice: (req, file) => {
	  return getPath(req, file, UPLOAD_DIRECTORIES.NOTICE);
	},
	bestPractice: (req, file) => {
	  if (!file) {
		return null;
	  }
	  return `${req.protocol}/${req.headers.host}/uploads/${UPLOAD_DIRECTORIES.BEST_PRACTICE}/${file}`;
	},
  };
  
  // Download attachment file
  const getFilePath = (req, fileName, originalFileName, dir) => {
	if (!fileName) {
	  return null;
	}
  
	return `${req.protocol}://${req.headers.host}/api/v1/user/downloadattachment/${dir}/${fileName}/${originalFileName}`;
  };
  
  export const GET_FILE_PATH = {
	smartFactory: (req, fileName, originalFileName) => {
	  return getFilePath(req, fileName, originalFileName, UPLOAD_DIRECTORIES.SMART_FACTORY);
	},
  };