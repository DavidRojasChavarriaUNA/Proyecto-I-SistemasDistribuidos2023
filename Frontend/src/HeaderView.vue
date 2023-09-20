<template>
    <header class="mb-5">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
                <router-link class="navbar-brand" to="/">
                    <img src="/assets/images/header/claqueta.png" alt="logo">
                    El cine y su música
                </router-link>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <router-link class="nav-link" to="/peliculas">Películas</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/compositores">Compositores</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/albumes">Álbumes</router-link>
                        </li>
                    </ul>
                    <form class="d-flex" role="search">
                        <input class="form-control me-2" type="search" placeholder="Buscar" aria-label="Search">
                        <button class="btn btn-outline-light" type="submit">Buscar</button>
                    </form>
                </div>
            </div>
        </nav>
        <!-- Se incorpora este link porque el sitio lo pide para su uso, se deja oculto con fines academicos -->
        <a href="https://www.flaticon.es/iconos-gratis/claqueta" title="claqueta iconos" style="display: none" target="_blank">
            Claqueta iconos creados por Freepik - Flaticon</a>
    </header>
</template>