// components/DependencyTable.vue
<script setup lang="ts">
import type { IVersion } from '../types'

export type DependencyItem = IVersion.asObject & {
    latestVersion?: string | null
    isLoading: boolean
    isError: boolean
    needsUpdate: boolean
    error?: string
}

defineProps<{
    title: string
    data: DependencyItem[]
    maxHeight?: string
}>()

// 获取版本状态的样式
const getVersionStyle = (row: DependencyItem) => {
    if (row.isError) return 'color: #f56c6c'
    if (!row.latestVersion) return ''
    return row.needsUpdate ? 'color: #f56c6c' : 'color: #67c23a'
}

</script>

<template>
    <div>
        <h1 class="text-xl font-bold mb-4">{{ title }}</h1>
        <el-table :data="data" border stripe :max-height="maxHeight">
            <el-table-column prop="name" label="依赖" />
            <el-table-column prop="version" label="当前版本" />
            <el-table-column label="最新版本">
                <template #default="{ row }">
                    <span :style="getVersionStyle(row)">
                        <template v-if="row.isError">获取失败</template>
                        <template v-else>
                            {{ row.latestVersion || '检查中...' }}
                        </template>
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="状态">
                <template #default="{ row }">
                    <el-tag v-if="row.isError" type="danger">
                        错误
                    </el-tag>
                    <el-tag v-else-if="row.latestVersion" :type="row.needsUpdate ? 'danger' : 'success'">
                        {{ row.needsUpdate ? '需要更新' : '已是最新' }}
                    </el-tag>
                    <el-tag v-else type="info">检查中</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>