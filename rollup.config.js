import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'

//  导出一个默认的数组，包含一个对象
export default [
    {
        //  输入文件路径
        input: 'packages/vue/src/index.ts',
        //  输出文件路径和格式
        output: [
            {
                //  生成sourcemap
                sourcemap: true,
                //  输出文件路径
                file: './packages/vue/dist/vue.js',
                //  输出格式
                format: 'iife',
                //  输出文件名称
                name: 'Vue'
            }
        ],
        //  插件
        plugins: [
            //  解析插件
            resolve(),
            //  commonjs插件
            commonjs(),
            //  typescript插件
            typescript({
                sourceMap: true,
            })
        ]

    }
]