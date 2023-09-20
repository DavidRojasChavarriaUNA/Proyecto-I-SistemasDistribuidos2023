'use strict';

const fs = require('fs');
const {
  Codigos,
  CrearRespuesta
} = require('../utils/Mensajes');

let albums = [];

const loadAlbumes = () => {
  fs.readFile(__dirname + '/' + 'albumes.json', 'utf8', (err, data) => {
    albums = JSON.parse(data)
  });
}

loadAlbumes();

const saveAlbums = () => {
  let data = JSON.stringify(albums)
  fs.writeFileSync(__dirname + '/' + 'albumes.json', data)
};


/**
 * Elimina un álbum por id.
 *
 * albumId Integer 
 * no response value expected for this operation
 **/
exports.albumDeleteById = function (albumId) {
  return new Promise(function (resolve, reject) {
    let index = albums.findIndex(i => i.id == albumId);
    if (index == -1)
      return reject(CrearRespuesta(Codigos.CodeNotFound, "Álbum no encontrado"));
    else {
      albums = albums.filter(i => i.id != albumId);
      saveAlbums();
      resolve(CrearRespuesta(Codigos.CodeSuccess, "Álbum eliminado con éxito"));
    }
  });
}


/**
 * Retorna todos los álbumes.
 *
 * returns List
 **/
exports.albumGetAll = function () {
  return new Promise(function (resolve, reject) {
    if (albums.length > 0)
      resolve(CrearRespuesta(Codigos.CodeSuccess, "", albums));
    reject(CrearRespuesta(Codigos.CodeNotFound, "No hay álbumes registrados"));
  });
}


/**
 * Retorna un álbum por Id.
 *
 * albumId Integer 
 * returns Album
 **/
exports.albumGetById = function (albumId) {
  return new Promise(function (resolve, reject) {
    let album = albums.find(i => i.id == albumId);
    if (album == undefined)
      return reject(CrearRespuesta(Codigos.CodeNotFound, "Álbum no encontrado"));
    else
      resolve(CrearRespuesta(Codigos.CodeSuccess, "", album));
  });
}


/**
 * Crea un nuevo álbum.
 *
 * body Album Datos álbume
 * no response value expected for this operation
 **/
exports.albumPOST = function (body) {
  return new Promise(function (resolve, reject) {
    let index = albums.findIndex(i => i.title == body.title);
    if (index != -1)
      return reject(CrearRespuesta(Codigos.CodeNotFound, "Ya existe un álbum con el nombre indicado"));
    else {
      body.id = albums.length + 1;
      albums.push(body);
      saveAlbums();
      resolve(CrearRespuesta(Codigos.CodeSuccess, "Álbum registrado con éxito", body.id));
    }
  });
}


/**
 * Actualiza la información de un compositor.
 *
 * body Album Datos álbum
 * albumId Integer 
 * no response value expected for this operation
 **/
exports.albumPutById = function (body, albumId) {
  return new Promise(function (resolve, reject) {
    let index = albums.findIndex(i => i.id == albumId);
    if (index == -1)
      return reject(CrearRespuesta(Codigos.CodeNotFound, "Álbum no encontrado"));
    else {
      albums[index] = body;
      saveAlbums();
      resolve(CrearRespuesta(Codigos.CodeSuccess, "Álbum actualizado con éxito"));
    }
  });
}