const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const rimraf = require('rimraf');

var router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '.' + req.originalUrl);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() +
      path.extname(file.originalname));
  }
});


const upload = multer({
  storage: storage,
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).array('files[]');

/* GET users listing. */
router.get('/', (req, res, next) => {
  const data = get_data(req.originalUrl)
  res.render('users', data);

});
/* POST users listing. */
router.post('/', (req, res) => {

  console.log(req.headers['content-type']); //Формы для создания папок и для загрузки имеют разные хедеры

  if (req.headers['content-type'] === 'application/x-www-form-urlencoded') { //Отдельно папки отдельно картинки

    console.log(req.originalUrl + req.body['folder_name']);

    const check = check_name(req.body['folder_name']); //Не пустая форма, и не кириллица
    if (check) {
      const data = get_data(req.originalUrl);
      data.msg_folder = check;
      res.render('users', data);
    } else {
      fs.mkdir('.' + req.originalUrl + req.body['folder_name'].replace(/ /ig, '_'), (err) => {
        if (err) {
          alterFolderName(req.originalUrl, req.body); //Если папка с таким именем уже есть, заменить
        };
      });
      res.redirect(req.originalUrl); //Использую редирект, чтобы полсе f5 форма не отправлялась заново
    }
  } else {
    upload(req, res, (err) => {
      if (err) {
        const data = get_data(req.originalUrl);
        data.msg_file = err;
        res.render('users', data);
      } else {
        if (req.files.length == 0) {
          const data = get_data(req.originalUrl);
          data.msg_file = 'Choose files!!';
          res.render('users', data);
        } else res.redirect(req.originalUrl); //Использую редирект, чтобы полсе f5 форма не отправлялась заново
      }
    });

  }
});
/* DELETE users listing. */
router.delete('/', (req, res) => {
  console.log('Path: ' + req.originalUrl);
  console.log('Headers: ' + req.headers['sure']);
  const reqPath = '.' + req.originalUrl;
  fs.lstat(reqPath, (err, stats) => {
    if (err)
      return console.log(err); //Handle error

    if (stats.isFile()) {
      fs.unlink(reqPath, function() {
        res.send({
          status: "200",
          responseType: "string",
          response: "success"
        });
      });
    } else {
      if (req.headers['sure'] === 'true') { //Если папка не пуста, спросить уверен ли пользователь что хочет удалить папку
        rimraf(reqPath, (err) => {
          console.log(err);
        });
        res.send({
          status: "200",
          responseType: "string",
          response: "success"
        });
      } else {
        fs.rmdir(reqPath, (err) => {
          if (err) {
            res.send({
              responseType: "string",
              response: "not empty"
            });
          } else {
            const data = get_data(req.originalUrl);
            res.render('users', data);
          }

        });
      }
    }
  });
});

module.exports = router;

function getDirectories(path) {
  return fs.readdirSync(path).filter(function(file) {
    return fs.statSync(path + '/' + file).isDirectory();
  });
};

function getImages(imageDir, callback) {
  var files = [];

  let filetypes = /jpeg|jpg|png/;
  let list = fs.readdirSync(imageDir)
  for (i = 0; i < list.length; i++) {
    if (filetypes.test(path.extname(list[i]))) {
      files.push(list[i]); //store the file name into the array files
    }
  }
  return files;
};

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (!(mimetype && extname)) {
    return cb('Error Inages Only');
  } else return cb(null, true);
};

function get_data(reqPath) {
  console.log('path: ' + reqPath);
  let dirs = getDirectories('.' + reqPath);
  console.log('Dirs: ' + dirs.length);
  let imgs = getImages('.' + reqPath);
  console.log('Imgs: ' + imgs);

  const data = {
    path: reqPath,
    dirs: dirs,
    imgs: imgs
  }

  return data
}

function check_name(name) {
  if (name == "") {
    return "Name must be filled out";
  } else if (name.match(/[а-яА-ЯЁё]/)) {
    return "Name must comtain only latin symbols";
  }
}

function alterFolderName(path, body) {
  const folders = getDirectories('.' + path);
  const mask = RegExp(body['folder_name'] + '\\(?\d?\\)?');
  let count = 0;
  for (let i = 0; i < folders.length; i++) {

    if (mask.test(folders[i])) count++;
  }

  fs.mkdirSync('.' + path + body['folder_name'].replace(/ /ig, '_') + '(' + count + ')');
};