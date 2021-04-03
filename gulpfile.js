const {
  src,
  dest,
  watch,
  series
} = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const gulpTerser = require('gulp-terser');
const terser = require('terser');
const imagemin = require('gulp-imagemin');
const browsersync = require('browser-sync').create();

// Sass Task
function scssTask() {
  return src('dev/scss/custom.scss', {
      sourcemaps: true
    })
    .pipe(sass())
    .pipe(postcss([cssnano]))
    .pipe(dest('dist/css', {
      sourcemaps: '.'
    }));
}

// Optimize Images Task
function imgTask() {
  return src('./dev/images/*')
    .pipe(imagemin())
    .pipe(dest('./dist/images'))
}

// Bundel JS
function jsPack() {
  return src(['./dev/js/*.js',
      './dev/js/script.js',
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
    ], {
      sourcemaps: true
    })
    .pipe(concat('bundle.js'))
    .pipe(dest('dist/js', {
      sourcemaps: '.'
    }));
}

// JavaScript Task
function jsTask() {
  return src('dev/js/script.js', {
      sourcemaps: true
    })
    .pipe(gulpTerser({}, terser.minify))
    .pipe(dest('dist/js', {
      sourcemaps: '.'
    }));
}

// Browsersync Tasks
function browsersyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: '.'
    }
  });
  cb();
}

function browsersyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask() {
  watch('*.html', browsersyncReload);
  watch(['dev/scss/**/*.scss', 'dev/js/**/*.js'], series(scssTask, jsTask, imgTask, jsPack, browsersyncReload));
}

// Default Gulp task
exports.default = series(
  scssTask,
  jsTask,
  jsPack,
  imgTask,
  browsersyncServe,
  watchTask
);
