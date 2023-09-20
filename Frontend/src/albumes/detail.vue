<template>
    <div class="row g-0">
        <div class="col-12">
            <section>
                <div class="row g-0 justify-content-md-center">
                    <div class="col-12 col-md-10 text-justify">
                        <h1 v-if='show'>{{album.title}}</h1>
                        <section v-if='create || edit'>
                            <h1>Nombre del álbum</h1>
                            <input class="form-control" type="text" v-model="album.title">
                        </section>
                        <div class="row g-0 justify-content-center">
                            <div class="col-8 col-md-4  text-center pt-3">
                                <section v-if='create || edit'>
                                    <h5>Imágen del álbum</h5>
                                    <input class="form-control" type="file" id="imgChooser" ImgTagIdToDisplay="imgAlbum"
                                        InputTagIdToStoreBase64Img="imgBase64" accept="image/*" />
                                    <input class="form-control" type="hidden" v-model="album.image" id="imgBase64">
                                    <img class="img-fluid imgChooser mt-3" :src="album.image" id="imgAlbum" />
                                </section>
                                <img v-if='show' class="img-fluid" :src="album.image">
                            </div>
                            <div class="col-12 col-md-8 text-justify pt-3 ps-md-4">
                                <h5>Banda sonora compuesta por:</h5>
                                <ul>
                                    <li v-for="compositor in album.compositores" :key="compositor.id">
                                        <router-link :to="`/verCompositor/${compositor.id}`" v-if='show'>
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
                                <h5>Pelicula:</h5>
                                <ul>
                                    <li>
                                        <router-link :to="`/verPelicula/${album.pelicula.id}`" v-if='show'>
                                            {{album.pelicula.nombre}}
                                        </router-link>
                                        <select class="form-select" v-model="album.pelicula" v-if='create || edit'>
                                            <option selected :value="{}">Seleccione un albúm</option>
                                            <option v-for="p in peliculas" :key="p.id"
                                                :value="{ id: p.id , nombre: p.title }">
                                                {{p.title}}
                                            </option>
                                        </select>
                                    </li>
                                </ul>
                                <h5>Discográfica</h5>
                                <ul v-if='show'>
                                    <li>{{album.discografica}}</li>
                                </ul>
                                <input class="form-control mb-3" type="text" v-model="album.discografica"
                                    v-if='create || edit'>
                                <h5>Duración</h5>
                                <ul v-if='show'>
                                    <li>{{album.duracion}}</li>
                                </ul>
                                <input class="form-control mb-3" type="text" v-model="album.duracion"
                                    v-if='create || edit'>
                            </div>
                            <hr class="mt-5">
                        </div>
                        <div class="row g-0 justify-content-center mt-4">
                            <div class="col-12 col-md-10 text-justify">
                                <div v-if='show' v-html="textoHtml()">
                                </div>
                                <div v-if='create || edit'>
                                    <h5>Información sobre el álbum</h5>
                                    <div class="row">
                                        <div class="col-6">
                                            <textarea class="form-control editor" v-model="album.textoMarkDown"
                                                placeholder="ingrese el texto en formato markdown"></textarea>
                                        </div>
                                        <div class="col-6">
                                            <div class="visualizador" v-html="textoHtml()">
                                            </div>
                                        </div>
                                    </div>
                                    <button type="button" class="btn btn-primary mt-3"
                                        v-on:click="GuardarAlbum">Guardar</button>
                                </div>
                                <br>
                                <router-link to="/albumes">Regresar</router-link>
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
                album: {
                    pelicula: {},
                    textoMarkDown: ""
                },
                compositorSeleccionado: null,
                peliculas: [],
                compositores: [],
            }
        },
        created() {
            if (this.edit || this.show)
                this.ObtenerAlbum();
            if (this.create)
                this.NuevoAlbum();
            if (this.create || this.edit) {
                this.ObtenerListadoDeCompositores();
                this.ObtenerListadoDePeliculas();
            }
        },
        mounted() {
            if (this.create || this.edit)
                AutoFileToBase64.InitElementById(`imgChooser`);
        },
        methods: {
            NuevoAlbum() {
                this.album = {
                    id: 0,
                    title: "",
                    image: "",
                    Resumen: "",
                    pelicula: {},
                    compositores: [],
                    discografica: "",
                    duracion: "",
                    textoMarkDown: ""
                }
            },
            async ObtenerAlbum() {
                try {
                    const idAlbum = this.$route.params.idAlbum;
                    const respuestaHttp = await fetch(`${urlBase}/albumes/${idAlbum}`, {
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                    const respuestaServidor = await respuestaHttp.json();
                    if (respuestaServidor.Code == Codigos.CodeSuccess) {
                        this.album = respuestaServidor.data;
                        this.$emit('mostrarMensaje', MensajeDatosRecientes);
                    } else {
                        this.$emit('mostrarMensaje', respuestaServidor);
                    }
                } catch (error) {
                    console.log(error);
                    this.$emit('mostrarMensaje', CrearMensajeError("Ocurrió un error al obtener el álbum"));
                }
            },
            GuardarAlbum() {
                if (this.album.id === 0)
                    this.CrearAlbum();
                else
                    this.ActualizarAlbum();
            },
            async CrearAlbum() {
                try {
                    const respuestaHttp = await fetch(`${urlBase}/albumes`, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(this.album)
                    });
                    const respuestaServidor = await respuestaHttp.json();
                    if (respuestaServidor.Code == Codigos.CodeSuccess) {
                        this.album.id = respuestaServidor.data;
                        this.$router.push(`/editarAlbum/${respuestaServidor.data}`);
                    }
                    this.$emit('mostrarMensaje', respuestaServidor);
                } catch (error) {
                    console.log(error);
                    this.$emit('mostrarMensaje', CrearMensajeError("Ocurrió un error al crear el compositor"));
                }
            },
            async ActualizarAlbum() {
                try {
                    const idAlbum = this.$route.params.idAlbum;
                    const respuestaHttp = await fetch(`${urlBase}/albumes/${idAlbum}`, {
                        method: 'PUT',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(this.album)
                    });
                    const respuestaServidor = await respuestaHttp.json();
                    this.$emit('mostrarMensaje', respuestaServidor);
                } catch (error) {
                    console.log(error);
                    this.$emit('mostrarMensaje', CrearMensajeError("Ocurrió un error al actualizar el álbum"));
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
            onSelectCompositor() {
                if (!this.compositorSeleccionado)
                    return;

                if (this.album.compositores.findIndex(c => c.id === this.compositorSeleccionado.id) !== -1) {
                    this.$emit('mostrarMensaje', CrearMensajeError(
                        "El compositor seleccionado, ya fue previamente agregado, seleccione otra opción"));
                    return;
                }
                this.album.compositores.push(this.compositorSeleccionado);
                this.compositorSeleccionado = null;
            },
            BorrarCompositorSeleccionado(idCompositor) {
                this.album.compositores = this.album.compositores.filter(c => c.id !== idCompositor);
            },
            textoHtml() {
                if ((this.create || this.edit) && !this.album.textoMarkDown)
                    return "Aqui se visualizará Información sobre el álbum, al ingresarse en formato markdown";
                return ConvertirMarkDownAHtml(this.album.textoMarkDown);
            }
        }
    }
</script>