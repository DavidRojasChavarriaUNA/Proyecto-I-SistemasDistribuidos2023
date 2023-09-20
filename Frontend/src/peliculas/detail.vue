<template>
    <div class="row g-0">
        <div class="col-12">
            <section>
                <div class="row g-0 justify-content-md-center">
                    <div class="col-12 col-md-10 text-justify">
                        <h1 v-if='show'>{{pelicula.title}}</h1>
                        <section v-if='create || edit'>
                            <h1>Título película</h1>
                            <input class="form-control" type="text" v-model="pelicula.title">
                        </section>
                        <div class="row g-0 justify-content-center">
                            <div class="col-8 col-md-4 text-center pt-3">
                                <section v-if='create || edit'>
                                    <h5>Imágen de la película</h5>
                                    <input class="form-control" type="file" id="imgChooser"
                                        ImgTagIdToDisplay="imgPelicula" InputTagIdToStoreBase64Img="imgBase64"
                                        accept="image/*" />
                                    <input class="form-control" type="hidden" v-model="pelicula.image" id="imgBase64">
                                    <img class="img-fluid imgChooser mt-3" :src="pelicula.image" id="imgPelicula" />
                                </section>
                                <img v-if='show' class="img-fluid" :src="pelicula.image" />
                            </div>
                            <div class="col-12 col-md-8 text-justify pt-3 ps-md-4">
                                <h5>Banda sonora compuesta por:</h5>
                                <ul>
                                    <li v-for="compositor in pelicula.compositores" :key="compositor.id">
                                        <router-link :to="'/verCompositor/'+compositor.id" v-if='show'>
                                            {{compositor.nombre}}
                                        </router-link>
                                        <template v-if='create || edit'>
                                            {{compositor.nombre}}
                                            <i class="bi bi-trash text-danger"
                                                @click="BorrarCompositorSeleccionado(compositor.id)"></i>
                                        </template>
                                    </li>
                                </ul>
                                <select class="form-select mb-3" v-model="compositorSeleccionado"
                                    @change="onSelectCompositor()" v-if='create || edit'>
                                    <option selected value="null">Seleccione un compositor para agregarlo</option>
                                    <option v-for="c in compositores" :key="c.id"
                                        :value="{ id: c.id , nombre: c.title }">
                                        {{c.title}}
                                    </option>
                                </select>
                                <h5>Album de la pelicula:</h5>
                                <ul>
                                    <li>
                                        <router-link :to="'/verAlbum/'+pelicula.album.id" v-if='show'>
                                            {{pelicula.album.nombre}}
                                        </router-link>
                                        <select class="form-select" v-model="pelicula.album" v-if='create || edit'>
                                            <option selected :value="{}">Seleccione un albúm</option>
                                            <option v-for="a in albumes" :key="a.id"
                                                :value="{ id: a.id , nombre: a.title }">
                                                {{a.title}}
                                            </option>
                                        </select>
                                    </li>
                                </ul>
                                <div v-if='show' v-html="textoHtml()">
                                </div>
                                <div v-if='create || edit'>
                                    <h5>Resumen de película</h5>
                                    <textarea class="form-control" rows="3"
                                        v-model="pelicula.Sinopsis"></textarea>
                                    <h5 class="mt-4">Descripción de la película</h5>
                                    <div class="row">
                                        <div class="col-6">
                                            <textarea class="form-control editor"
                                                v-model="pelicula.textoMarkDown" placeholder="ingrese el texto en formato markdown"></textarea>
                                        </div>
                                        <div class="col-6">
                                            <div class="visualizador" v-html="textoHtml()">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr class="mt-3">
                        </div>
                    </div>
                </div>
                <div class="row g-0 justify-content-center mt-4">
                    <div class="col-12 col-md-10 text-justify">
                        <h3>Trailer de la película</h3>
                        <div class="containerVideo" v-if='show'>
                            <iframe :src="pelicula.trailer" title="YouTube video player" frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen class="video"></iframe>
                        </div>
                        <template v-if='create || edit'>
                            <input class="form-control" type="url" v-if='create || edit' v-model="pelicula.trailer"
                                placeholder="Enlace embed a youtube, ejemplo https://www.youtube.com/embed/EBk1lXQ7rcY">
                            <button type="button" class="btn btn-primary mt-3"
                                v-on:click="GuardarPelicula">Guardar</button>
                        </template>
                        <br>
                        <router-link to="/peliculas">Regresar</router-link>
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
                pelicula: {
                    album: {},
                    textoMarkDown: ""
                },
                albumes: [],
                compositores: [],
                compositorSeleccionado: null
            }
        },
        created() {
            if (this.edit || this.show)
                this.ObtenerPelicula();
            if (this.create)
                this.NuevaPelicula();
            if (this.create || this.edit) {
                this.ObtenerListadoDeCompositores();
                this.ObtenerListadoDeAlbumes();
            }
        },
        mounted() {
            if (this.create || this.edit)
                AutoFileToBase64.InitElementById(`imgChooser`);
        },
        methods: {
            NuevaPelicula() {
                this.pelicula = {
                    id: 0,
                    title: "",
                    image: "",
                    Sinopsis: "",
                    compositores: [],
                    album: {},
                    trailer: "",
                    textoMarkDown: ""
                };
            },
            async ObtenerPelicula() {
                try {
                    const idPelicula = this.$route.params.idPelicula;
                    const respuestaHttp = await fetch(`${urlBase}/peliculas/${idPelicula}`, {
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                    const respuestaServidor = await respuestaHttp.json();
                    if (respuestaServidor.Code == Codigos.CodeSuccess) {
                        this.pelicula = respuestaServidor.data;
                        this.$emit('mostrarMensaje', MensajeDatosRecientes);
                    } else {
                        this.$emit('mostrarMensaje', respuestaServidor);
                    }
                } catch (error) {
                    console.log(error);
                    this.$emit('mostrarMensaje', CrearMensajeError("Ocurrió un error al obtener la película"));
                }
            },
            GuardarPelicula() {
                if (this.pelicula.id === 0)
                    this.CrearPelicula();
                else
                    this.ActualizarPelicula();
            },
            async CrearPelicula() {
                try {
                    const respuestaHttp = await fetch(`${urlBase}/peliculas`, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(this.pelicula)
                    });
                    const respuestaServidor = await respuestaHttp.json();
                    if (respuestaServidor.Code == Codigos.CodeSuccess) {
                        this.pelicula.id = respuestaServidor.data;
                        this.$router.push(`/editarPelicula/${respuestaServidor.data}`);
                    }
                    this.$emit('mostrarMensaje', respuestaServidor);
                } catch (error) {
                    console.log(error);
                    this.$emit('mostrarMensaje', CrearMensajeError("Ocurrió un error al crear la película"));
                }
            },
            async ActualizarPelicula() {
                try {
                    const idPelicula = this.$route.params.idPelicula;
                    const respuestaHttp = await fetch(`${urlBase}/peliculas/${idPelicula}`, {
                        method: 'PUT',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(this.pelicula)
                    });
                    const respuestaServidor = await respuestaHttp.json();
                    this.$emit('mostrarMensaje', respuestaServidor);
                } catch (error) {
                    console.log(error);
                    this.$emit('mostrarMensaje', CrearMensajeError("Ocurrió un error al actualizar la película"));
                }
            },
            async ObtenerListadoDeCompositores() {
                try {
                    const respuestaHttp = await fetch(`${urlBase}/compositores`, {
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                    const respuestaServidor = await respuestaHttp.json();
                    if (respuestaServidor.Code == Codigos.CodeSuccess) {
                        this.compositores = respuestaServidor.data;
                    } else {
                        this.$emit('mostrarMensaje', respuestaServidor);
                    }
                } catch (error) {
                    console.log(error);
                    this.$emit('mostrarMensaje', CrearMensajeError("Ocurrió un error al obtener los compositores"));
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
            onSelectCompositor() {
                if (!this.compositorSeleccionado)
                    return;

                if (this.pelicula.compositores.findIndex(c => c.id === this.compositorSeleccionado.id) !== -1) {
                    this.$emit('mostrarMensaje', CrearMensajeError(
                        "El compositor seleccionado, ya fue previamente agregado, seleccione otra opción"));
                    return;
                }
                this.pelicula.compositores.push(this.compositorSeleccionado);
                this.compositorSeleccionado = null;
            },
            BorrarCompositorSeleccionado(idCompositor) {
                this.pelicula.compositores = this.pelicula.compositores.filter(c => c.id !== idCompositor);
            },
            textoHtml() {
                if ((this.create || this.edit) && !this.pelicula.textoMarkDown)
                    return "Aqui se visualizará la descripción de la película, al ingresarse en formato markdown";
                return ConvertirMarkDownAHtml(this.pelicula.textoMarkDown);
            }
        }
    }
</script>