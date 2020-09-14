<template>
    <div class="container" style="width: 100%">
        <div style="width: 100%;background-color: #e4b9c0">
            <el-autocomplete
                    prefix-icon="el-icon-search"
                    placeholder="搜索"
            ></el-autocomplete>
        </div>

    </div>
</template>

<script>
    import {Autocomplete} from 'element-ui'
    export default {
        name: 'worktable',
        components: {
            ElAutocomplete: Autocomplete,
        },
    }
</script>

<style scoped>
    .container{
        display:flex ;
        height:100%;
        background-color: white;
    }

</style>


