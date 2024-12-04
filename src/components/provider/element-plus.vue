<script setup lang="ts">
import { ref } from 'vue'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
const zIndex = ref(3000)
const size = ref<"" | "default" | "small" | "large">("small")
const locale = ref(zhCn)

</script>

<template>
    <el-config-provider :size="size" :z-index="zIndex" :locale="locale">
        <slot></slot>
    </el-config-provider>
</template>

<style scoped></style>
