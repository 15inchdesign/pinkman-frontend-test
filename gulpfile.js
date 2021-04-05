const {
  src,
  dest,
  watch,
  series
} = require('gulp');
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano'); 
const minify = require('gulp-minify');
const imagemin = require('gulp-imagemin');
const browsersync = require('browser-sync').create();



// Minify HTML
function htmlTask() {
  return src('index.html', {

    })
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(dest('dist'));
}

// Sass Task
function scssTask() {
  return src('dev/scss/custom.scss', {
     // sourcemaps: true
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

// Minify JS
function minTask(){
  return src(['dev/js/script.js',
  'node_modules/jquery/dist/jquery.js',
  'node_modules/bootstrap/dist/js/bootstrap.js',
  'node_modules/swiper/swiper-bundle.js'])
  .pipe(minify({
    ext: {
        min: '.min.js'
    },
    ignoreFiles: ['-min.js']
}))
.pipe(dest('dist/js'));
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
  watch(['dev/scss/**/*.scss', 'dev/js/**/*.js'], series(htmlTask, scssTask, imgTask, minTask, browsersyncReload));
}

// Default Gulp task
exports.default = series(
  htmlTask,
  scssTask,
  minTask,
  imgTask,
  browsersyncServe,
  watchTask
);
