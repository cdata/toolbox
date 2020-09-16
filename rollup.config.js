import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import sourcemaps from 'rollup-plugin-sourcemaps';
import {terser} from 'rollup-plugin-terser';

const plugins = [
  resolve({browser: true, preferBuiltins: false}),
  sourcemaps(),
  replace({'Reflect.decorate': 'undefined'}),
  terser(),
];

const onwarn = (warning, warn) => {
  if (warning.code !== 'THIS_IS_UNDEFINED') {
    warn(warning);
  }
};

const common = {
  plugins,
  onwarn,
};

export default [
  {
    input: './lib/index.js',
    output: {
      dir: './dist',
      sourcemap: true,
      format: 'esm',
    },
    watch: {
      include: ['lib/**'],
      clearScreen: false,
    },
    ...common,
  },
];
