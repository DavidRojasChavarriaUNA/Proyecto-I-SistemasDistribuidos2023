<template>
    <div class="row g-0">
        <div class="col-12">
            <section>
                <div class="row g-0 justify-content-md-center">
                    <div class="col-12 col-md-10 text-justify">
                        <h1>Catálogo de peliculas</h1>
                        <p class="text-justify">
                            Quieres conocer sobre las películas, compositores y álbumes, te invitamos a que selecciones
                            una pelicula
                            de nuestro catálogo para descubrirlo.
                        </p>
                        <router-link to="/nuevaPelicula" class="btn btn-primary">Nueva película</router-link>
                    </div>
                </div>
                <div class="row g-0 justify-content-md-center">
                    <div class="col-12 col-md-10 text-justify">
                        <div class="row g-0 justify-content-center">
                            <div class="col-10 col-sm-6 col-md-4" v-for="pelicula in peliculas" :key="pelicula.id">
                                <div class="card m-3">
                                    <img :src="pelicula.image" class="card-img-top" :alt="'Imagen ' + pelicula.title" />
                                    <div class="card-body">
                                        <h5 class="card-title">{{ pelicula.title }}</h5>
                                        <p class="card-text">
                                            {{pelicula.Sinopsis}}
                                        </p>
                                        <div class="text-center">
                                            <router-link class="btn btn-primary btn-sm"
                                                :to="`/editarPelicula/${pelicula.id}`">Modificar</router-link>
                                            <button class="btn btn-danger btn-sm ms-1 me-1" data-bs-toggle="modal"
                                                :data-bs-target="`#modalEliminar${pelicula.id}`">Eliminar</button>
                                            <router-link class="btn btn-info btn-sm"
                                                :to="`/verPelicula/${pelicula.id}`">Ver detalle</router-link>
                                            <modal-eliminar-vue v-bind:id="pelicula.id"
                                                v-on:notificarEliminar="notificarEliminar(pelicula.id)">
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
                peliculas: []
            }
        },
        created() {
            this.ObtenerListadoDePeliculas();
        },
        methods: {
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
                        this.$emit('mostrarMensaje', MensajeDatosRecientes);
                    } else {
                        this.$emit('mostrarMensaje', respuestaServidor);
                    }
                } catch (error) {
                    console.log(error);
                    this.$emit('mostrarMensaje', CrearMensajeError("Ocurrió un error al obtener las películas"));
                }
            },
            async notificarEliminar(peliculaId) {
                cerrarModalEliminar(peliculaId);
                try {
                    const respuestaHttp = await fetch(`${urlBase}/peliculas/${peliculaId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    });
                    const respuestaServidor = await respuestaHttp.json();
                    this.$emit('mostrarMensaje', respuestaServidor);
                    this.ObtenerListadoDePeliculas();
                } catch (error) {
                    console.log(error);
                    this.$emit('mostrarMensaje', CrearMensajeError("Ocurrió un error al eliminar la película"));
                }
            },
        }
    }
</script>