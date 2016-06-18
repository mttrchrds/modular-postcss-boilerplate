var paths = require('./paths'),
    gulp = require('gulp'),
    postcss = require('gulp-postcss'),
    stylelint = require('stylelint'),
    reporter = require('postcss-reporter'),
    autoprefixer = require('autoprefixer'),
    atImport = require('postcss-import'),
    cssnano = require('cssnano'),
    rename = require('gulp-rename'),
    nested = require('postcss-nested'),
    mixins = require('postcss-mixins'),
    discardComments = require('postcss-discard-comments'),
    calc = require('postcss-calc'),
    customMedia = require('postcss-custom-media'),
    simpleVars = require('postcss-simple-vars');

gulp.task('stylelint', function () {
  return gulp.src(paths.sourceCSS + '/**/*.css')
    .pipe(postcss(
      [
        stylelint(),
        reporter({ clearMessages: true })
      ]
    ));
});

// Building CSS for development use
gulp.task('build-css-dev', function () {
  var processors = [
    atImport,
    nested,
    mixins,
    customMedia,
    simpleVars,
    calc({mediaQueries: true})
  ];
  return gulp.src(paths.sourceCSS + '/root.css')
    .pipe(postcss(processors))
    .pipe(rename('main.css'))
    .pipe(gulp.dest(paths.buildCSS));
});

// Building CSS for production use.
// Note inclusion of cssnano (minification/optimisation), Autoprefixer & discardComments
gulp.task('build-css-prod', function () {
  var processors = [
    atImport,
    nested,
    mixins,
    simpleVars,
    customMedia,
    calc({mediaQueries: true}),
    discardComments,
    autoprefixer({browsers: ['last 2 versions']}),
    cssnano
  ];
  return gulp.src(paths.sourceCSS + '/root.css')
    .pipe(postcss(processors))
    .pipe(rename('main.css'))
    .pipe(gulp.dest(paths.buildCSS));
});

gulp.task('default', ['stylelint', 'build-css-dev'], function() {
  gulp.watch(paths.sourceCSS + '/**/*.css', ['stylelint', 'build-css-dev']);
});
