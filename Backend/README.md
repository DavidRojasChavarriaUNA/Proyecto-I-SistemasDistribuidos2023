# Universidad Nacional 
## Escuela de Informática 
### Sistemas Distribuidos.

#### Proyecto I.

Estudiante: 
David Rojas Chavarría
Cédula
114310962
Profesor:
Armando Arce Orozco.

Ciclo II 2023

Repositorio
    url github
Sitio web
Podrá acceder al sitio web del proyecto I en la siguiente dirección web:
    url sitio

Para desarrollo

	Paso 1.
	ingresar al archivo .env y dejar la variable de entorno con la url del server de desarrollo
	VITE_BASE_URL=UrlDelServidor
	ejemplo
	VITE_BASE_URL=http://localhost:8089/server

	Paso 2.
	Ejecutar el comando npm run dev

Para generar publicado

	Paso 1.
	ingresar al archivo .env y dejar la variable de entorno 
	VITE_BASE_URL=/server

	Paso 2.
	Ejecutar el comando npm run build

	Paso 3.
	Publicar el contenido de la carpeta dist en el servidor

	Paso 4.
	publicar la carpeta server en el servidor