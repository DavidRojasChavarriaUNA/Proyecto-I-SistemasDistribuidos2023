'use strict';

var utils = require('../utils/writer.js');
var Albumes = require('../service/AlbumesService');

module.exports.albumDeleteById = function albumDeleteById (req, res, next, albumId) {
  Albumes.albumDeleteById(albumId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.albumGetAll = function albumGetAll (req, res, next) {
  Albumes.albumGetAll()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.albumGetById = function albumGetById (req, res, next, albumId) {
  Albumes.albumGetById(albumId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.albumPOST = function albumPOST (req, res, next, body) {
  Albumes.albumPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.albumPutById = function albumPutById (req, res, next, body, albumId) {
  Albumes.albumPutById(body, albumId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

