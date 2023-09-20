'use strict';

var utils = require('../utils/writer.js');
var Peliculas = require('../service/PeliculasService');

module.exports.movieDeleteById = function movieDeleteById (req, res, next, peliculaId) {
  Peliculas.movieDeleteById(peliculaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.movieGetById = function movieGetById (req, res, next, peliculaId) {
  Peliculas.movieGetById(peliculaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.moviePOST = function moviePOST (req, res, next, body) {
  Peliculas.moviePOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.moviePutById = function moviePutById (req, res, next, body, peliculaId) {
  Peliculas.moviePutById(body, peliculaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.moviesGetAll = function moviesGetAll (req, res, next) {
  Peliculas.moviesGetAll()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
