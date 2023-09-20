import * as bootstrap from 'bootstrap';
import {marked} from 'marked';

const None = -1;
const CodeSuccess = 0;
const CodeUnautorized = 401;
const CodeExpired = 440;
const CodeNotFound = 404;
const CodeError = 99;

export const Codigos = {
    None,
    CodeSuccess,
    CodeUnautorized,
    CodeExpired,
    CodeNotFound,
    CodeError
};

export const cerrarModalEliminar = (id) => {
    const modalEliminarElem = document.querySelector(`#modalEliminar${id}`);
    const modalEliminar = bootstrap.Modal.getInstance(modalEliminarElem);
    modalEliminar.hide();
}

export const MensajeDatosRecientes = {
    Code: Codigos.CodeSuccess,
    message: "Se ha obtenido los datos más recientes"
};

export const CrearMensajeError = (message) => {
    return {
        Code: Codigos.CodeError,
        message
    };
}

export const ConvertirMarkDownAHtml = (marckdown) => {
    return marked.parse(marckdown);
}