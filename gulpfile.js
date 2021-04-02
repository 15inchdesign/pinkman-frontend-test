const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const gulpTerser = require('gulp-terser');
const terser =require('terser');
const images = require('gulp-image');
const browsersync = require('browser-sync').create();

// Sass Task
function scssTask(){
  return src('dev/scss/custom.scss', { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([cssnano]))
    .pipe(dest('dist/css', { sourcemaps: '.' }));
}

// Optimize Images Task
function imgTask() {
    return src('dev/images', { sourcemaps: true })
    .pipe(images())
    .pipe(dest('dist/images'), { sourcemaps: true })
}

// JavaScript Task
function jsTask(){
  return src('dev/js/script.js', 'dev/js/metismenujs', { sourcemaps: true })
    .pipe(gulpTerser({}, terser.minify))
    .pipe(dest('dist/js', { sourcemaps: '.' }));
}

// Browsersync Tasks
function browsersyncServe(cb){
  browsersync.init({
    server: {
      baseDir: '.'
    }
  });
  cb();
}

function browsersyncReload(cb){
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask(){
  watch('*.html', browsersyncReload);
  watch(['dev/scss/**/*.scss', 'dev/js/**/*.js'], series(scssTask, jsTask, browsersyncReload, imgTask));
}

// Default Gulp task
exports.default = series(
  scssTask,
  jsTask,
  browsersyncServe,
  imgTask,
  watchTask
);
