const multer = require('multer');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.PUBLIC_PATH);
  },
  filename: (req, file, cb) => {
    // cb(null, `${Date.now()}-${file.originalname}`);
    cb(null, `${file.originalname}-${Date.now()}.zip`);

  }
});

const upload = multer({ storage });

module.exports = upload;


// cb(null, `${Date.now()}-${file.originalname}`);
