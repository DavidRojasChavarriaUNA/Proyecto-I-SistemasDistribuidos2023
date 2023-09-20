const None = -1;
const CodeSuccess = 0;
const CodeUnautorized = 401;
const CodeExpired = 440;
const CodeNotFound = 404;
const CodeError = 99;

exports.Codigos = {
    None,
    CodeSuccess,
    CodeUnautorized,
    CodeExpired,
    CodeNotFound,
    CodeError
};

exports.CrearRespuesta = function(Code, message, data = undefined){
    return {
        Code,
        message,
        data
    };
}