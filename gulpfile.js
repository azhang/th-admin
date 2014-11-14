var gulp = require('gulp')
  , gutil = require('gulp-util')
  , source = require('vinyl-source-stream')
  , buffer = require('vinyl-buffer')
  , watchify = require('watchify')
  , browserify = require('browserify')
  , sass = require('gulp-sass')
  , minifyCSS = require('gulp-minify-css')
  , notify = require('gulp-notify')
  , sourcemaps = require('gulp-sourcemaps')
  , uglify = require('gulp-uglify')
  , es6ify = require('es6ify')
  , reactify = require('reactify')
  , connect = require('gulp-connect')
  , livereload = require('gulp-livereload')
;

var STYLES = []
  , JSENTRY = "./js/app.jsx"
;

gulp.task('watch', function() {

  connect.server({
    root: '',
    livereload: true
  });

  // CSS
  gulp.watch(STYLES, ['sass']);

  // JS with Browserify
  watchify.args.debug = true;
  watchify.args.extensions = [".jsx"];
  var bundler = watchify(browserify(JSENTRY, watchify.args));
  bundler.transform(reactify);
  bundler.transform(es6ify.configure(/^(?!.*node_modules)+.+\.js(x?)$/));

  bundler.on('update', rebundle);

  function rebundle() {
    return bundler.bundle()
      .on('error', notify.onError("<%= error.message %>"))
      //.on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('app.js'))
      .pipe(gulp.dest('build'))
      .pipe(connect.reload())
      .pipe(notify("Finished building js"));
  }

  return rebundle();
});

gulp.task('connect', function() {
  connect.server({
    root: 'app',
    livereload: true
  });
});


gulp.task('sass', function() {
  gulp.src("./client/thinkerous.scss")
    .pipe(sourcemaps.init())
      .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build'))
    .pipe(livereload())
    .pipe(notify("Finished building scss"));
});


gulp.task('files', function() {
  gulp.src(['./client/*/images/**'])
    .pipe(gulp.dest('build/client'))
    .pipe(notify("Finished copying files"));
});


gulp.task('browserify', function() {
  var bundler = browserify('./client/boot/index.js', { debug: true, extensions: [".jsx"] });
  bundler.transform(reactify);
  bundler.transform(es6ify.configure(/^(?!.*node_modules)+.+\.js(x?)$/));

  var bundle = function() {
    return bundler.bundle()
      .on('error', notify.onError("<%= error.message %>"))
      .pipe(source('thinkerous.js'))
      .pipe(gulp.dest('build'))
      .pipe(notify("Finished building js"));
  };
  return bundle();
});


gulp.task('dist', function() {
  // TODO: clean dir
  // TODO: jshint (https://github.com/gulpjs/gulp/blob/master/docs/recipes/incremental-builds-with-concatenate.md)
  // TODO: documentation
  // TODO: testing
  // TODO: Deliver (push to server)
  // TODO: Push to CDN
  // TODO: Version bumper

  // CSS
  gulp.src("./client/thinkerous.scss")
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(gulp.dest('dist'));
  
  // Files
  gulp.src(['./client/*/images/**'])
    .pipe(gulp.dest('dist/client'));

  // JS with Browserify
  var bundler = browserify('./client/boot/index.js', {extensions: [".jsx"]});
  bundler.transform(reactify);
  bundler.transform(es6ify.configure(/^(?!.*node_modules)+.+\.js(x?)$/));

  bundler.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('thinkerous.js'))
    .pipe(buffer())
    .pipe(uglify({ compress: { drop_console:true } }))
    .pipe(gulp.dest('dist'));
  

  /*var rackspace = {
    'username': '',
    'apiKey': '',
    'region': '',
    'container': ''
  };

  gulp.src('./dist/**', {read: false})
    .pipe(cloudfiles(rackspace));*/
});

gulp.task('default', ['sass', 'files', 'browserify']);

