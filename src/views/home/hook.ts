// hooks/useDependencyVersions.ts
import { ref, computed } from 'vue'
import { useQueries, useMutation } from '@tanstack/vue-query'
import { getVersion } from './api'
import type { IVersion } from './types'

export interface DependencyItem extends IVersion.asObject {
    latestVersion?: string
    isLoading?: boolean
    isError?: boolean
    needsUpdate?: boolean
}

export function useDependencyVersions(dependencies: { [key: string]: string }, type: 'dependency' | 'devDependency') {
    // 移除版本号中的 ^ ~ 等前缀
    const cleanVersion = (version: string) => version.replace(/[\^~]/g, '')

    const getList = (data: { [key: string]: string }): IVersion.asObject[] =>
        Object.keys(data).map(key => ({
            name: key,
            version: cleanVersion(data[key])
        }))

    const dependenciesData = ref<IVersion.asObject[]>(getList(dependencies))

    // 创建版本查询
    const versionQueries = useQueries({
        queries: dependenciesData.value.map(dep => ({
            queryKey: [type, dep.name],
            queryFn: () => getVersion(dep.name),
            staleTime: 1000 * 60 * 5, // 5分钟缓存
        }))
    })

    // 刷新查询的mutation
    const refreshMutation = useMutation({
        mutationFn: async () => {
            await Promise.all(versionQueries.value.map(query => query.refetch()))
        }
    })

    // 合并查询结果与原始数据
    const mergeQueryResults = computed(() =>
        dependenciesData.value.map((dep, index) => {
            return {
                ...dep,
                latestVersion: versionQueries.value[index].data?.version,
                isLoading: versionQueries.value[index].isLoading,
                isError: versionQueries.value[index].isError,
                needsUpdate: versionQueries.value[index].data ?
                    dep.version !== versionQueries.value[index].data.version :
                    false
            }
        })
    )

    const isLoading = computed(() =>
        versionQueries.value.some(query => query.isLoading)
    )

    return {
        dependencies: mergeQueryResults,
        isLoading,
        refresh: refreshMutation.mutate,
        isRefreshing: refreshMutation.isPending
    }
}