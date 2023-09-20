'use strict';

var path = require('path');
var http = require('http');

//https://github.com/akapuya/oas3-tools-with-cors
var oas3Tools = require('oas3-tools-cors');//paquete que soluciona el problema de cors de oas3-tools
var serverPort = 8086;

//https://github.com/expressjs/cors
var cors = require("cors");//paquete para facilitar el acceso y restricciones causadas por el cors

var bodyParser = require('body-parser');

// swaggerRouter configuration
var options = {
    routing: {
        controllers: path.join(__dirname, './controllers')
    },
    //se habilita cors
    cors: cors(),
    //procesos intermedios se agrega para aumentear el tamaño de los request y recibir json grandes
    middleware: [
        bodyParser.json({limit: "100mb"}),
        bodyParser.urlencoded({limit: "100mb"})
    ]
};

var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
var app = expressAppConfig.getApp();

// Initialize the Swagger middleware
http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
});

