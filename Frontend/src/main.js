import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './css/site.css'

import index from './index.vue'
import peliculasIndex from './peliculas/index.vue'
import peliculaDetalle from './peliculas/detail.vue'
import compositoresIndex from './compositores/index.vue'
import compositorDetalle from './compositores/detail.vue'
import albumesIndex from './albumes/index.vue'
import albumDetalle from './albumes/detail.vue'

const routes = [
    { path: '/', component: index},
    { path: '/peliculas', component: peliculasIndex },
    { path: '/nuevaPelicula', component: peliculaDetalle, props: {create: true} },
    { path: '/editarPelicula/:idPelicula', component: peliculaDetalle, props: {edit: true} },
    { path: '/verPelicula/:idPelicula', component: peliculaDetalle, props: {show: true} },
    { path: '/compositores', component: compositoresIndex },
    { path: '/nuevoCompositor', component: compositorDetalle, props: {create: true} },
    { path: '/editarCompositor/:idCompositor', component: compositorDetalle, props: {edit: true} },
    { path: '/verCompositor/:idCompositor', component: compositorDetalle, props: {show: true} },
    { path: '/albumes', component: albumesIndex },
    { path: '/nuevoAlbum', component: albumDetalle, props: {create: true} },
    { path: '/editarAlbum/:idAlbum', component: albumDetalle, props: {edit: true} },
    { path: '/verAlbum/:idAlbum', component: albumDetalle, props: {show: true} }
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

const app = createApp(App)

app.use(router)

app.mount('#app')