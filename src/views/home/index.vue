// DependencyChecker.vue
<script setup lang="ts">
import { useDependencyVersions } from './hook'
import DependencyTable from './components/table.vue'
import pkg from '../../../package.json'
import { computed } from 'vue';

const { dependencies: prodDeps, isLoading: isProdLoading, refresh: refreshProd, isRefreshing: isRefreshingProd } =
    useDependencyVersions(pkg.dependencies, 'dependency')

const { dependencies: devDeps, isLoading: isDevLoading, refresh: refreshDev, isRefreshing: isRefreshingDev } =
    useDependencyVersions(pkg.devDependencies, 'devDependency')

const refreshAll = async () => {
    await Promise.all([refreshProd(), refreshDev()])
}

const isLoading = computed(() => isProdLoading.value || isDevLoading.value)
const isRefreshing = computed(() => isRefreshingProd.value || isRefreshingDev.value)
</script>

<template>
    <div class="p-4">
        <div class="mb-4 flex items-center justify-between">
            <h1 class="text-xl font-bold">依赖版本检查</h1>
            <el-button type="primary" @click="refreshAll" :loading="isRefreshing || isLoading">
                检查更新
            </el-button>
        </div>
        <DependencyTable title="生产依赖" :data="prodDeps" />
        <div class="mt-8">
            <DependencyTable title="开发依赖" :data="devDeps" max-height="20vh" />
        </div>
    </div>
</template>