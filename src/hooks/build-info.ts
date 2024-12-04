// hooks/useBuildInfo.ts
import { onMounted } from 'vue';
import pkg from '../../package.json';

export function useBuildInfo() {
    const print = (key: string, value: string) => {
        console.log(
            `%c ${key} %c ${value} %c `,
            'background:#20232a ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
            'background:#61dafb ;padding: 1px; border-radius: 0 3px 3px 0;  color: #20232a; font-weight: bold;',
            'background:transparent'
        );
    };

    const printBuildInfo = () => {
        print(pkg.name, pkg.version);
        print('build time', `${import.meta.env.VITE_APP_BUILD_TIME}`);
    };

    return {
        logBuildInfo: printBuildInfo
    };
}