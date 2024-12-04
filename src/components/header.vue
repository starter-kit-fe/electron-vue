<script setup lang="ts">
import { RouterLink } from 'vue-router'

</script>

<style scoped></style>
<template>
    <div class="py-10">
        <div class="">
            <div class="">
                <h1 class="text-4xl font-bold underline">You did it!</h1>
                <h3>
                    You’ve successfully created a project with
                    <a href="https://vite.dev/" target="_blank" rel="noopener">Vite</a>+
                    <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>+
                    <a href="https://element-plus.org/" target="_blank" rel="noopener">Element plus</a>+
                    <a href="https://tailwindcss.com/" target="_blank" rel="noopener">Tailwind CSS</a>
                    . What's next?
                </h3>
            </div>
            <nav>
                <el-button link type="primary">
                    <RouterLink to="/">Home</RouterLink>
                </el-button>
                <el-divider direction="vertical" />
                <el-button link type="primary">
                    <RouterLink to="/about">About</RouterLink>
                </el-button>
            </nav>
        </div>
    </div>
</template>
