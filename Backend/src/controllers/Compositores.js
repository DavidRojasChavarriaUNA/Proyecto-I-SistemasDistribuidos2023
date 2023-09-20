'use strict';

var utils = require('../utils/writer.js');
var Compositores = require('../service/CompositoresService');

module.exports.composerDeleteById = function composerDeleteById (req, res, next, compositorId) {
  Compositores.composerDeleteById(compositorId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.composerGetById = function composerGetById (req, res, next, compositorId) {
  Compositores.composerGetById(compositorId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.composerPOST = function composerPOST (req, res, next, body) {
  Compositores.composerPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.composerPutById = function composerPutById (req, res, next, body, compositorId) {
  Compositores.composerPutById(body, compositorId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.composersGetAll = function composersGetAll (req, res, next) {
  Compositores.composersGetAll()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
