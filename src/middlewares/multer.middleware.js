import multer from "multer";

//storing file in our diskstorage of server .. can also be stored elsewhere
//read the documentation 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp') // cb is call back function and stores local path
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.originalname)
    }
  })

// multer acts as a middleware between the server and the client
// helps in uploading file in cloudinary, need to brush up more please bear for now
export const upload = multer({ 
    storage,
})   