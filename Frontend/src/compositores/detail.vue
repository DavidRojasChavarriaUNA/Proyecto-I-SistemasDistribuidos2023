<template>
    <div class="row g-0">
        <div class="col-12">
            <section>
                <div class="row g-0 justify-content-md-center">
                    <div class="col-12 col-md-10 text-justify">
                        <h1 v-if='show'>{{compositor.title}}</h1>
                        <section v-if='create || edit'>
                            <h1>Nombre de compositor</h1>
                            <input class="form-control" type="text" v-model="compositor.title">
                        </section>
                        <div class="row g-0 justify-content-center">
                            <div class="col-8 col-md-4  text-center">
                                <section v-if='create || edit'>
                                    <h5>Imágen del compositor</h5>
                                    <input class="form-control" type="file" id="imgChooser"
                                        ImgTagIdToDisplay="imgCompositor" InputTagIdToStoreBase64Img="imgBase64"
                                        accept="image/*" />
                                    <input class="form-control" type="hidden" v-model="compositor.image" id="imgBase64">
                                    <img class="img-fluid imgChooser mt-3" :src="compositor.image" id="imgCompositor" />
                                </section>
                                <img v-if='show' class="img-fluid" :src="compositor.image">
                            </div>
                            <div class="col-12 col-md-8 text-justify pt-3 ps-md-4">
                                <h5>Peliculas:</h5>
                                <ul>
                                    <li v-for="pelicula in compositor.peliculas" :key="pelicula.id">
                                        <router-link :to="`/verPelicula/${pelicula.id}`" v-if='show'>
                                            {{pelicula.nombre}}
                                        </router-link>
                                        <template v-if='create || edit'>
                                            {{pelicula.nombre}}
                                            <i class="bi bi-trash text-danger"
                                                @click="BorrarPeliculaSeleccionada(pelicula.id)"></i>
                                        </template>
                                    </li>
                                </ul>
                                <select class="form-select mb-3" v-model="peliculaSeleccionada"
                                    @change="onSelectPelicula()" v-if='create || edit'>
                                    <option selected value="null">Seleccione una película para agregarla</option>
                                    <option v-for="p in peliculas" :key="p.id" :value="{ id: p.id , nombre: p.title }">
                                        {{p.title}}
                                    </option>
                                </select>
                                <h5>Álbumes de peliculas:</h5>
                                <ul>
                                    <li v-for="album in compositor.albumes" :key="album.id">
                                        <router-link :to="`/verAlbum/${album.id}`" v-if='show'>
                                            {{album.nombre}}
                                        </router-link>
                                        <template v-if='create || edit'>
                                            {{album.nombre}}
                                            <i class="bi bi-trash text-danger"
                                                @click="BorrarAlbumSeleccionada(album.id)"></i>
                                        </template>
                                    </li>
                                </ul>
                                <select class="form-select mb-3" v-model="albumSeleccionado" @change="onSelectAlbum()"
                                    v-if='create || edit'>
                                    <option selected value="null">Seleccione un álbum para agregarlo</option>
                                    <option v-for="c in albumes" :key="c.id" :value="{ id: c.id , nombre: c.title }">
                                        {{c.title}}
                                    </option>
                                </select>

                                <div v-if='create || edit'>
                                    <h5>Resumen del compositor</h5>
                                    <textarea class="form-control" rows="3" v-if='create || edit'
                                        v-model="compositor.Resumen"></textarea>
                                </div>

                            </div>

                            <hr class="mt-5">
                        </div>
                        <div class="row g-0 justify-content-center mt-4">
                            <div class="col-12 col-md-12 text-justify">
                                <div v-if='show' v-html="textoHtml()">
                                </div>
                                <div v-if='create || edit'>
                                    <h5>Información sobre el compositor</h5>
                                    <div class="row">
                                        <div class="col-6">
                                            <textarea class="form-control editor" v-model="compositor.textoMarkDown"
                                                placeholder="ingrese el texto en formato markdown"></textarea>
                                        </div>
                                        <div class="col-6">
                                            <div class="visualizador" v-html="textoHtml()">
                                            </div>
                                        </div>
                                    </div>

                                    <button type="button" class="btn btn-primary mt-3"
                                        v-on:click="GuardarCompositor">Guardar</button>
                                </div>
                                <br>
                                <router-link to="/compositores">Regresar</router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
    const urlBase =
        import.meta.env.VITE_BASE_URL;
    import {
        Codigos,
        MensajeDatosRecientes,
        CrearMensajeError,
        ConvertirMarkDownAHtml
    } from '../js/Util';
    import AutoFileToBase64 from '../js/AutoFileToBase64';

    export default {
        props: ['create', 'edit', 'show'],
        data() {
            return {
                compositor: {
                    textoMarkDown: ""
                },
                peliculaSeleccionada: null,
                albumSeleccionado: null,
                albumes: [],
                peliculas: [],
            }
        },
        created() {
            if (this.edit || this.show)
                this.ObtenerCompositor();
            if (this.create)
                this.NuevoCompositor();
            if (this.create || this.edit) {
                this.ObtenerListadoDePeliculas();
                this.ObtenerListadoDeAlbumes();
            }
        },
        mounted() {
            if (this.create || this.edit)
                AutoFileToBase64.InitElementById(`imgChooser`);
        },
        methods: {
            NuevoCompositor() {
                this.compositor = {
                    id: 0,
                    title: "",
                    image: "",
                    Resumen: "",
                    peliculas: [],
                    albumes: [],
                    textoMarkDown: ""
                }
            },
            async ObtenerCompositor() {
                try {
                    const idCompositor = this.$route.params.idCompositor;
                    const respuestaHttp = await fetch(`${urlBase}/compositores/${idCompositor}`, {
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                    const respuestaServidor = await respuestaHttp.json();
                    if (respuestaServidor.Code == Codigos.CodeSuccess) {
                        this.compositor = respuestaServidor.data;
                        this.$emit('mostrarMensaje', MensajeDatosRecientes);
                    } else {
                        this.$emit('mostrarMensaje', respuestaServidor);
                    }
                } catch (error) {
                    console.log(error);
                    this.$emit('mostrarMensaje', CrearMensajeError("Ocurrió un error al actualizar el compositor"));
                }
            },
            GuardarCompositor() {
                if (this.compositor.id === 0)
                    this.CrearCompositor();
                else
                    this.ActualizarCompositor();
            },
            async CrearCompositor() {
                try {
                    const respuestaHttp = await fetch(`${urlBase}/compositores`, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(this.compositor)
                    });
                    const respuestaServidor = await respuestaHttp.json();
                    if (respuestaServidor.Code == Codigos.CodeSuccess) {
                        this.compositor.id = respuestaServidor.data;
                        this.$router.push(`/editarCompositor/${respuestaServidor.data}`);
                    }
                    this.$emit('mostrarMensaje', respuestaServidor);
                } catch (error) {
                    console.log(error);
                    this.$emit('mostrarMensaje', CrearMensajeError("Ocurrió un error al crear el compositor"));
                }
            },
            async ActualizarCompositor() {
                try {
                    const idCompositor = this.$route.params.idCompositor;
                    const respuestaHttp = await fetch(`${urlBase}/compositores/${idCompositor}`, {
                        method: 'PUT',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(this.compositor)
                    });
                    const respuestaServidor = await respuestaHttp.json();
                    this.$emit('mostrarMensaje', respuestaServidor);
                } catch (error) {
                    console.log(error);
                    this.$emit('mostrarMensaje', CrearMensajeError("Ocurrió un error al obtener la película"));
                }
            },
            async ObtenerListadoDePeliculas() {
                try {
                    const respuestaHttp = await fetch(`${urlBase}/peliculas`, {
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                    const respuestaServidor = await respuestaHttp.json();
                    if (respuestaServidor.Code == Codigos.CodeSuccess) {
                        this.peliculas = respuestaServidor.data;
                    } else {
                        this.$emit('mostrarMensaje', respuestaServidor);
                    }
                } catch (error) {
                    console.log(error);
                    this.$emit('mostrarMensaje', CrearMensajeError("Ocurrió un error al obtener las películas"));
                }
            },
            async ObtenerListadoDeAlbumes() {
                try {
                    const respuestaHttp = await fetch(`${urlBase}/albumes`, {
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                    const respuestaServidor = await respuestaHttp.json();
                    if (respuestaServidor.Code == Codigos.CodeSuccess) {
                        this.albumes = respuestaServidor.data;
                    } else {
                        this.$emit('mostrarMensaje', respuestaServidor);
                    }
                } catch (error) {
                    console.log(error);
                    this.$emit('mostrarMensaje', CrearMensajeError("Ocurrió un error al obtener los álbumes"));
                }
            },
            onSelectPelicula() {
                if (!this.peliculaSeleccionada)
                    return;

                if (this.compositor.peliculas.findIndex(c => c.id === this.peliculaSeleccionada.id) !== -1) {
                    this.$emit('mostrarMensaje', CrearMensajeError(
                        "La pelicula seleccionada, ya fue previamente agregada, seleccione otra opción"));
                    return;
                }
                this.compositor.peliculas.push(this.peliculaSeleccionada);
                this.peliculaSeleccionada = null;
            },
            onSelectAlbum() {
                if (!this.albumSeleccionado)
                    return;

                if (this.compositor.albumes.findIndex(c => c.id === this.albumSeleccionado.id) !== -1) {
                    this.$emit('mostrarMensaje', CrearMensajeError(
                        "El albúm seleccionado, ya fue previamente agregado, seleccione otra opción"));
                    return;
                }
                this.compositor.albumes.push(this.albumSeleccionado);
                this.albumSeleccionado = null;
            },
            BorrarPeliculaSeleccionada(idPelicula) {
                this.compositor.peliculas = this.compositor.peliculas.filter(p => p.id !== idPelicula);
            },
            BorrarAlbumSeleccionada(idAlbum) {
                this.compositor.albumes = this.compositor.albumes.filter(a => a.id !== idAlbum);
            },
            textoHtml() {
                if ((this.create || this.edit) && !this.compositor.textoMarkDown)
                    return "Aqui se visualizará el resumen del compositor, al ingresarse en formato markdown";
                return ConvertirMarkDownAHtml(this.compositor.textoMarkDown);
            }
        }
    }
</script>