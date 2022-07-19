
module.exports = (path) =>{

        return {
            destination: function (req, file, cb) {
              cb(null,  path)
            },
            filename: function (req, file, cb) {
                   console.log("from here", file);
              cb(null,  Date.now() + file.originalname) //Appending extension
            }
        }
}