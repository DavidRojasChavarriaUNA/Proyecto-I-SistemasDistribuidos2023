'use strict';

const fs = require('fs');
const {
  Codigos,
  CrearRespuesta
} = require('../utils/Mensajes');

let movies = [];

const loadMovies = () => {
  fs.readFile(__dirname + '/' + 'peliculas.json', 'utf8', (err, data) => {
    movies = JSON.parse(data)
  });
}

loadMovies();

const saveMovies = () => {
  let data = JSON.stringify(movies)
  fs.writeFileSync(__dirname + '/' + 'peliculas.json', data)
};


/**
 * Elimina una película por id.
 *
 * peliculaId String 
 * no response value expected for this operation
 **/
exports.movieDeleteById = function (peliculaId) {
  return new Promise(function (resolve, reject) {
    let index = movies.findIndex(i => i.id == peliculaId);
    if (index == -1)
      return reject(CrearRespuesta(Codigos.CodeNotFound, "Película no encontrada"));
    else {
      movies = movies.filter(i => i.id != peliculaId);
      saveMovies();
      resolve(CrearRespuesta(Codigos.CodeSuccess, "Película eliminada con éxito"));
    }
  });
}


/**
 * Retorna todas las peliculas.
 *
 * returns List
 **/
exports.moviesGetAll = function () {
  return new Promise(function (resolve, reject) {
    if (movies.length > 0)
      resolve(CrearRespuesta(Codigos.CodeSuccess, "", movies));
    reject(CrearRespuesta(Codigos.CodeNotFound, "No hay películas registradas"));
  });
}


/**
 * Retorna una pelicula por Id.
 *
 * peliculaId Integer 
 * returns Movie
 **/
exports.movieGetById = function (peliculaId) {
  return new Promise(function (resolve, reject) {
    let movie = movies.find(i => i.id == peliculaId);
    if (movie == undefined)
      return reject(CrearRespuesta(Codigos.CodeNotFound, "Película no encontrada"));
    else
      resolve(CrearRespuesta(Codigos.CodeSuccess, "", movie));
  });
}


/**
 * Crea una nueva película.
 *
 * body Movie Datos película
 * no response value expected for this operation
 **/
exports.moviePOST = function (body) {
  return new Promise(function (resolve, reject) {
    let index = movies.findIndex(i => i.title == body.title);
    if (index != -1)
      return reject(CrearRespuesta(Codigos.CodeNotFound, "Ya existe una película con el título indicado"));
    else {
      body.id = movies.length + 1;
      movies.push(body);
      saveMovies();
      resolve(CrearRespuesta(Codigos.CodeSuccess, "Película registrada con éxito", body.id));
    }
  });
}


/**
 * Actualiza la información de una película.
 *
 * body Movie Datos película
 * peliculaId String 
 * no response value expected for this operation
 **/
exports.moviePutById = function (body, peliculaId) {
  return new Promise(function (resolve, reject) {
    let index = movies.findIndex(i => i.id == peliculaId);
    if (index == -1)
      return reject(CrearRespuesta(Codigos.CodeNotFound, "Película no encontrada"));
    else {
      movies[index] = body;
      saveMovies();
      resolve(CrearRespuesta(Codigos.CodeSuccess, "Película actualizada con éxito"));
    }
  });
}