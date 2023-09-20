'use strict';

const fs = require('fs');
const {
  Codigos,
  CrearRespuesta
} = require('../utils/Mensajes');

let composers = [];

const loadComposers = () => {
  fs.readFile(__dirname + '/' + 'compositores.json', 'utf8', (err, data) => {
    composers = JSON.parse(data)
  });
}

loadComposers();

const saveComposers = () => {
  let data = JSON.stringify(composers)
  fs.writeFileSync(__dirname + '/' + 'compositores.json', data)
};


/**
 * Elimina un compositor por id.
 *
 * compositorId Integer 
 * no response value expected for this operation
 **/
exports.composerDeleteById = function (compositorId) {
  return new Promise(function (resolve, reject) {
    let index = composers.findIndex(i => i.id == compositorId);
    if (index == -1)
      return reject(CrearRespuesta(Codigos.CodeNotFound, "Compositor no encontrado"));
    else {
      composers = composers.filter(i => i.id != compositorId);
      saveComposers();
      resolve(CrearRespuesta(Codigos.CodeSuccess, "Compositor eliminado con éxito"));
    }
  });
}

/**
 * Retorna todos los compositores.
 *
 * returns List
 **/
exports.composersGetAll = function () {
  return new Promise(function (resolve, reject) {
    if (composers.length > 0)
      resolve(CrearRespuesta(Codigos.CodeSuccess, "", composers));
    reject(CrearRespuesta(Codigos.CodeNotFound, "No hay compositores registrados"));
  });
}

/**
 * Retorna un compositor por Id.
 *
 * compositorId Integer 
 * returns Composer
 **/
exports.composerGetById = function (compositorId) {
  return new Promise(function (resolve, reject) {
    let composer = composers.find(i => i.id == compositorId);
    if (composer == undefined)
      return reject(CrearRespuesta(Codigos.CodeNotFound, "Compositor no encontrado"));
    else
      resolve(CrearRespuesta(Codigos.CodeSuccess, "", composer));
  });
}


/**
 * Crea un nuevo compositor.
 *
 * body Composer Datos compositor
 * no response value expected for this operation
 **/
exports.composerPOST = function (body) {
  return new Promise(function (resolve, reject) {
    let index = composers.findIndex(i => i.title == body.title);
    if (index != -1)
      return reject(CrearRespuesta(Codigos.CodeNotFound, "Ya existe un compositor con el nombre indicado"));
    else {
      body.id = composers.length + 1;
      composers.push(body);
      saveComposers();
      resolve(CrearRespuesta(Codigos.CodeSuccess, "Compositor registrado con éxito", body.id));
    }
  });
}


/**
 * Actualiza la información de un compositor.
 *
 * body Composer Datos compositor
 * compositorId Integer 
 * no response value expected for this operation
 **/
exports.composerPutById = function (body, compositorId) {
  return new Promise(function (resolve, reject) {
    let index = composers.findIndex(i => i.id == compositorId);
    if (index == -1)
      return reject(CrearRespuesta(Codigos.CodeNotFound, "Compositor no encontrado"));
    else {
      composers[index] = body;
      saveComposers();
      resolve(CrearRespuesta(Codigos.CodeSuccess, "Compositor actualizado con éxito"));
    }
  });
}