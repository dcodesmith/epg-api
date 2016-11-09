import del from 'del';
import gulp from 'gulp';
import path from 'path';
import runSequence from 'run-sequence';
import babelCompiler from 'babel-core/register';
import gulpLoadPlugins from 'gulp-load-plugins';
import yargs from 'yargs';

const argv = yargs.argv;
const plugins = gulpLoadPlugins();

const paths = {
  js: ['./**/*.js', '!dist/**', '!node_modules/**'],
  nonJs: ['./package.json', './.gitignore'],
  tests: {
    integration: './test/integration/**/*.js',
    unit: './test/unit/**/*.js'
  },
  build: 'dist'
};

gulp.task('clean', () =>
  del(['dist/**', '!dist'])
);

gulp.task('copy', () =>
  gulp.src(paths.nonJs)
    .pipe(plugins.newer(paths.build))
    .pipe(gulp.dest(paths.build))
);

gulp.task('babel', () =>
  gulp.src([...paths.js, '!gulpfile.babel.js'], { base: '.' })
    .pipe(plugins.newer(paths.build))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.babel())
    .pipe(plugins.sourcemaps.write('.', {
      includeContent: false,
      sourceRoot(file) {
        return path.relative(file.path, __dirname);
      }
    }))
    .pipe(gulp.dest(paths.build))
);

gulp.task('nodemon', ['copy', 'babel'], () =>
  plugins.nodemon({
    script: path.join(paths.build, 'index.js'),
    ext: 'js',
    ignore: ['node_modules/**/*.js', 'dist/**/*.js'],
    tasks: ['copy', 'babel']
  })
);

gulp.task('test', () => {
  let exitCode = 0;
  const testType = argv.integration ? 'integration' : 'unit';

  return gulp.src([paths.tests[testType]], { read: false })
    .pipe(plugins.plumber())
    .pipe(plugins.mocha({
      reporter: 'spec',
      ui: 'bdd',
      recursive: true,
      compilers: {
        js: babelCompiler
      }
    }))
    .once('error', (err) => {
      plugins.util.log(err);
      exitCode = 1;
    })
    .once('end', () => {
      plugins.util.log('completed !!');
      process.exit(exitCode);
    });
});

gulp.task('serve', ['clean'], () => runSequence('nodemon'));

gulp.task('default', ['clean'], () => {
  runSequence(['copy', 'babel']);
});
