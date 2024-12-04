import { request } from '@/utils/request'
import type { IVersion } from './types'

export const getVersion = (name: string) => {
    return fetch(`https://registry.npmjs.org/${name}/latest`, {
        method: "GET",
    }).then(async res => await res.json());
}
