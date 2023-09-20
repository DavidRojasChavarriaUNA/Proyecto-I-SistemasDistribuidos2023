<template>
    <div class="row g-0">
        <div class="col-12">
            <section>
                <div class="row g-0 justify-content-md-center">
                    <div class="col-12 col-md-10 text-justify">
                        <h1>Catálogo de álbumes de peliculas</h1>
                        <p class="text-justify">
                            Conoce la información de los álbumes de las peliculas y sus compositores, te invitamos a que
                            selecciones un álbum
                            de nuestro catálogo para descubrirlo.
                        </p>
                        <router-link to="/nuevoAlbum" class="btn btn-primary">Nuevo álbum</router-link>
                    </div>
                </div>
                <div class="row g-0 justify-content-md-center">
                    <div class="col-12 col-md-10 text-justify">
                        <div class="row g-0 justify-content-center">
                            <div class="col-10 col-sm-6 col-md-4" v-for="album in albumes" :key="album.id">
                                <div class="card m-3">
                                    <img :src="album.image" class="card-img-top" :alt="'Imagen ' + album.title" />
                                    <div class="card-body">
                                        <h5 class="card-title">{{ album.title }}</h5>
                                        <p class="card-text">
                                            {{album.Sinopsis}}
                                        </p>
                                        <div class="text-center">
                                            <router-link class="btn btn-primary btn-sm"
                                                :to="`/editarAlbum/${album.id}`">Modificar</router-link>
                                            <button class="btn btn-danger btn-sm ms-1 me-1" data-bs-toggle="modal"
                                                :data-bs-target="`#modalEliminar${album.id}`">Eliminar</button>
                                            <router-link class="btn btn-info btn-sm" :to="`/verAlbum/${album.id}`">
                                                Ver detalle</router-link>
                                            <modal-eliminar-vue v-bind:id="album.id"
                                                v-on:notificarEliminar="notificarEliminar(album.id)">
                                            </modal-eliminar-vue>
                                        </div>
                                    </div>
                                </div>
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
    import modalEliminarVue from '../ModalEliminar.vue';
    import {
        Codigos,
        cerrarModalEliminar,
        MensajeDatosRecientes,
        CrearMensajeError
    } from '../js/Util';

    export default {
        components: {
            modalEliminarVue
        },
        data() {
            return {
                albumes: []
            }
        },
        created() {
            this.ObtenerListadoDeAlbumes();
        },
        methods: {
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
                        this.$emit('mostrarMensaje', MensajeDatosRecientes);
                    } else {
                        this.$emit('mostrarMensaje', respuestaServidor);
                    }
                } catch (error) {
                    console.log(error);
                    this.$emit('mostrarMensaje', CrearMensajeError("Ocurrió un error al obtener los álbumes"));
                }
            },
            async notificarEliminar(albumId) {
                cerrarModalEliminar(albumId);
                try {
                    const respuestaHttp = await fetch(`${urlBase}/albumes/${albumId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    });
                    const respuestaServidor = await respuestaHttp.json();
                    this.$emit('mostrarMensaje', respuestaServidor);
                    this.ObtenerListadoDeAlbumes();
                } catch (error) {
                    console.log(error);
                    this.$emit('mostrarMensaje', CrearMensajeError("Ocurrió un error al eliminar la película"));
                }
            },
        }
    }
</script>