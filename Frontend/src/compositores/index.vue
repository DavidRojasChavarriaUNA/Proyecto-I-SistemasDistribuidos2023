<template>
    <div class="row g-0">
        <div class="col-12">
            <section>
                <div class="row g-0 justify-content-md-center">
                    <div class="col-12 col-md-10 text-justify">
                        <h1>Catálogo de compositores</h1>
                        <p class="text-justify">
                            Conoce la información de los compositores de las bandas sonoras de las peliculas y sus
                            álbumes, te invitamos a que selecciones un compositor
                            de nuestro catálogo para descubrirlo.
                        </p>
                        <router-link to="/nuevoCompositor" class="btn btn-primary">Nuevo compositor</router-link>
                    </div>
                </div>
                <div class="row g-0 justify-content-md-center">
                    <div class="col-12 col-md-10 text-justify">
                        <div class="row g-0 justify-content-center">
                            <div class="col-10 col-sm-6 col-md-4" v-for="compositor in compositores"
                                :key="compositor.id">
                                <div class="card m-3">
                                    <img :src="compositor.image" class="card-img-top"
                                        :alt="'Imagen ' + compositor.title" />
                                    <div class="card-body">
                                        <h5 class="card-title">{{ compositor.title }}</h5>
                                        <p class="card-text">
                                            {{compositor.Resumen}}
                                        </p>
                                        <div class="text-center">
                                            <router-link class="btn btn-primary btn-sm"
                                                :to="`/editarCompositor/${compositor.id}`">Modificar</router-link>
                                            <button class="btn btn-danger btn-sm ms-1 me-1" data-bs-toggle="modal"
                                                :data-bs-target="`#modalEliminar${compositor.id}`">Eliminar</button>
                                            <router-link class="btn btn-info btn-sm"
                                                :to="`/verCompositor/${compositor.id}`">Ver detalle</router-link>
                                            <modal-eliminar-vue v-bind:id="compositor.id"
                                                v-on:notificarEliminar="notificarEliminar(compositor.id)">
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
                compositores: []
            }
        },
        created() {
            this.ObtenerListadoDeCompositores();
        },
        methods: {
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
                        this.$emit('mostrarMensaje', MensajeDatosRecientes);
                    } else {
                        this.$emit('mostrarMensaje', respuestaServidor);
                    }
                } catch (error) {
                    console.log(error);
                    this.$emit('mostrarMensaje', CrearMensajeError("Ocurrió un error al obtener los compositores"));
                }
            },
            async notificarEliminar(compositorId) {
                cerrarModalEliminar(compositorId);
                try {
                    const respuestaHttp = await fetch(`${urlBase}/compositores/${compositorId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    });
                    const respuestaServidor = await respuestaHttp.json();
                    this.$emit('mostrarMensaje', respuestaServidor);
                    this.ObtenerListadoDeCompositores();
                } catch (error) {
                    console.log(error);
                    this.$emit('mostrarMensaje', CrearMensajeError("Ocurrió un error al eliminar el compositor"));
                }
            },
        }
    }
</script>