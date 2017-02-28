/**
* Configuration.
*
* Project Configuration for gulp tasks.
*
* Edit the variables as per your project requirements.
*/

var project             = 'wp-plugin-gulp'; // Name

var styleSRC            = './files/assets/css/**/style.scss'; // Path to main .scss file
var styleDestination    = './files/css/'; // Path to place the compiled CSS file

var jsVendorSRC         = './files/assets/vendors/*.js'; // Path to JS vendors folder
var jsVendorDestination = './files/js/'; // Path to place the compiled JS vendors file
var jsVendorFile        = 'vendors'; // Compiled JS vendors file name

var jsCustomSRC         = './files/assets/js/*.js'; // Path to JS custom scripts folder
var jsCustomDestination = './files/js/'; // Path to place the compiled JS custom scripts file
var jsCustomFile        = 'custom'; // Compiled JS custom file name
// Default set to custom i.e. custom.js

var styleWatchFiles     = './files/assets/css/**/*.scss'; // Path to all *.scss files inside css folder and inside them
var vendorJSWatchFiles  = './files/assets/js/vendors/*.js'; // Path to all vendors JS files
var customJSWatchFiles  = './files/assets/js/*.js'; // Path to all custom JS files

/**
 * Load Plugins.
 *
 * Load gulp plugins and assing them semantic names.
 */
var gulp         = require('gulp'); // Gulp of-course

// CSS related plugins.
var sass         = require('gulp-sass'); // Gulp pluign for Sass compilation
var autoprefixer = require('gulp-autoprefixer'); // Autoprefixing magic
var minifycss    = require('gulp-uglifycss'); // Minifies CSS files

// JS related plugins.
var concat       = require('gulp-concat'); // Concatenates JS files
var uglify       = require('gulp-uglify'); // Minifies JS files
var plumber      = require('gulp-plumber');
var jshint       = require('gulp-jshint');

// Utility related plugins.
var rename       = require('gulp-rename'); // Renames files E.g. style.css -> style.min.css
var sourcemaps   = require('gulp-sourcemaps'); // Maps code in a compressed file (E.g. style.css) back to it’s original position in a source file (E.g. structure.scss, which was later combined with other css files to generate style.css)
var notify       = require('gulp-notify'); // Sends message notification to you

/**
 * Task: styles
 *
 * Compiles Sass, Autoprefixes it and Minifies CSS.
 *
 * This task does the following:
 *    1. Gets the source scss file
 *    2. Compiles Sass to CSS
 *    3. Writes Sourcemaps for it
 *    4. Autoprefixes it and generates style.css
 *    5. Renames the CSS file with suffix .min.css
 *    6. Minifies the CSS file and generates style.min.css
 */
 gulp.task('styles', function(){
  return gulp.src(styleSRC)
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}) )
  .pipe(sourcemaps.init())
  .pipe(sass({
    errLogToConsole: true,
    outputStyle: 'compact',
    //outputStyle: 'compressed',
    // outputStyle: 'nested',
    // outputStyle: 'expanded',
    precision: 10
  }))
  .pipe( sourcemaps.write( { includeContent: false } ) )
  .pipe( sourcemaps.init( { loadMaps: true } ) )
  .pipe( autoprefixer(
    'last 2 version',
    '> 1%',
    'safari 5',
    'ie 8',
    'ie 9',
    'opera 12.1',
    'ios 6',
    'android 4' ) )
  .pipe( sourcemaps.write ( styleDestination ) )
  .pipe( gulp.dest( styleDestination ) )
  .pipe( minifycss ({
    "maxLineLen": 80,
    "uglyComments": true
  }))
  .pipe( rename( { suffix: '.min' } ) )
  .pipe( gulp.dest( styleDestination ) )
  .pipe( notify( { message: 'TASK: "styles" Completed! 💯', onLast: true } ) );
});

/**
 * Task: vendorJS
 *
 * Concatenate and uglify vendor JS scripts.
 *
 * This task does the following:
 *    1. Gets the source folder for JS vendor files
 *    2. Concatenates all the files and generates vendors.js
 *    3. Renames the JS file with suffix .min.js
 *    4. Uglifes/Minifies the JS file and generates vendors.min.js
 */
 gulp.task( 'vendorsJs', function() {
  gulp.src( jsVendorSRC )
  .pipe( plumber({errorHandler: notify.onError("Error: <%= error.message %>")}) )
  .pipe( jshint() )
  .pipe( jshint.reporter('jshint-stylish') )
  .pipe( concat( jsVendorFile + '.js' ) )
  .pipe( gulp.dest( jsVendorDestination ) )
  .pipe( rename( {
    basename: jsVendorFile,
    suffix: '.min'
  }))
  .pipe( uglify() )
  .pipe( gulp.dest( jsVendorDestination ) )
  .pipe( notify( { message: 'TASK: "vendorsJs" Completed!', onLast: true } ) );
});

/**
 * Task: customJS
 *
 * Concatenate and uglify custom JS scripts.
 *
 * This task does the following:
 *    1. Gets the source folder for JS custom files
 *    2. Concatenates all the files and generates custom.js
 *    3. Renames the JS file with suffix .min.js
 *    4. Uglifes/Minifies the JS file and generates custom.min.js
 */
 gulp.task( 'customJS', function() {
  gulp.src( jsCustomSRC )
  .pipe( plumber({errorHandler: notify.onError("Error: <%= error.message %>")}) )
  .pipe( jshint() )
  .pipe( jshint.reporter('jshint-stylish') )
  .pipe( concat( jsCustomFile + '.js' ) )
  .pipe( gulp.dest( jsCustomDestination ) )
  .pipe( rename( {
    basename: jsCustomFile,
    suffix: '.min'
  }))
  .pipe( uglify() )
  .pipe( gulp.dest( jsCustomDestination ) )
  .pipe( notify( { message: 'TASK: "customJs" Completed!', onLast: true } ) );
});

/**
  * Watch Tasks.
  *
  * Watches for file changes and runs specific tasks.
  */

  gulp.task( 'default', [ 'styles', 'vendorsJs', 'customJS' ], function () {
    gulp.watch( './files/assets/css/**/*.scss', [ 'styles' ] );
    gulp.watch( './files/assets/js/vendors/*.js', [ 'vendorsJs' ] );
    gulp.watch( './files/assets/js/*.js', [ 'customJS' ] );
  });