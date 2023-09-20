<template>
  <main class="container-fluid px-4 px-md-0">
    <header-view></header-view>
    <router-view v-on:mostrarMensaje="mostrarMensaje"></router-view>
    <section>
      <div id="toastMensajes" class="toast-container position-absolute p-3 bottom-0 end-0" style="position: fixed !important;">
      </div>
    </section>
    <footer-view></footer-view>
  </main>
</template>

<script>
  import * as bootstrap from 'bootstrap';
  import headerView from './HeaderView.vue'
  import footerView from './FooterView.vue'
  import {
    Codigos
  } from './js/Util';

  export default {
    components: {
      headerView,
      footerView
    },
    data() {
      return {}
    },
    methods: {
      mostrarMensaje(respuestaServidor) {
        const htmlToast = this.CrearHtmlToast(respuestaServidor);
        this.inicializarToast(htmlToast);
      },
      CrearHtmlToast(respuestaServidor) {
        const toastString = `<div class="toast" role="alert" data-bs-delay="5000" data-bs-autohide="true" aria-live="assertive" aria-atomic="true">
                              <div class="toast-header">
                                <strong class="me-auto">Mensaje</strong>
                                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                              </div>
                              <div class="toast-body">
                                <p>${respuestaServidor.Code} - ${respuestaServidor.message}</p>
                              </div>
                            </div>`;

        const parser = new DOMParser();
        const domHtml = parser.parseFromString(toastString, "text/html");
        const toastMensajes = document.querySelector("#toastMensajes");
        const htmlToast = domHtml.body.firstChild;
        toastMensajes.appendChild(htmlToast);
        return htmlToast;
      },
      inicializarToast(toastElem) {
        if (!toastElem)
          return;
        toastElem.addEventListener('hide.bs.toast', function () {
          toastElem.remove();
        });
        const toast = bootstrap.Toast.getOrCreateInstance(toastElem);
        toast.show();
      }
    }
  }
</script>