const multer = require('multer');

const allowTypes = [
  'image/png',
  'image/jpg',
  'image/jpeg'
];

const fileFilter = (req, { mimetype }, cb) => (
  cb(null, Boolean(allowTypes.indexOf(mimetype) > -1))
);

const storage = multer.memoryStorage();

module.exports = (app) => {
  app.use(multer({ storage, fileFilter }).single('image'));
};
