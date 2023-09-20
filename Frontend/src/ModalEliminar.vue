<template>
    <!-- Modal Eliminar-->
    
    <div class="modal fade" :id="`modalEliminar${id}`" tabindex="-1" aria-labelledby="labelEliminar" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="labelEliminar">Eliminar</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                ¿Desea eliminar el registro seleccionado?
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-danger" @click="notificarEliminar">Eliminar</button>
            </div>
        </div>
    </div>
</div>
</template>

<script>
    export default {
        props:['id'],
        methods:{
            notificarEliminar(){
                this.$emit('notificarEliminar');
            }
        }
    }
</script>