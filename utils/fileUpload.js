const multer = require('multer')
const fs = require('fs')
const sharp = require('sharp')
const multerStorage = multer.memoryStorage()
const multerFilter = (req, file, cb) => {
    fs.writeFileSync('mytext.txt','Hello world')
    if(file.mimetype.startsWith("image")){
        cb(null, true)
    } else {
            cb(new Error('Not an image'), false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

exports.uploadSingle = upload.single('signature')

exports.resizeUploadedImage = (async (req, res, next) => {
    if(!req.file) return 
  
    req.body.signature = `sign.jpg`;
    await sharp(req.file.buffer)
      // .resize(132, 170)
      .resize(300)
      .toFormat("jpeg")
      .flatten({background:'#fff'})
      .jpeg({ quality: 80 })
      .toFile(`public/${req.body.signature}`);
  
    // // 2) Images
    // req.body.images = [];
  
    // await Promise.all(
    //   req.files.images.map(async (file, i) => {
    //     const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
  
    //     await sharp(file.buffer)
    //       .resize(2000, 1333)
    //       .toFormat("jpeg")
    //       .jpeg({ quality: 90 })
    //       .toFile(`public/img/tours/${filename}`);
  
    //     req.body.images.push(filename);
    //   })
    // );
  
    next();
  });