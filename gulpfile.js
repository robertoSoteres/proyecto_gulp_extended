//Link con ejemplos y con todos los valores predeterminados
//https://www.npmjs.com/package/gulp-image-resize

var gulp = require('gulp'),
    imageResize = require('gulp-image-resize'),
    clean = require('gulp-clean'),
    gp_concat = require('gulp-concat'),
    gp_uglify = require('gulp-uglify'),
    gp_rename = require('gulp-rename'),
    gp_sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const jshint = require('gulp-jshint');
let cleanCSS = require('gulp-clean-css');

// para reducir el peso de las imágenes y mantener el mismo tamaño
gulp.task('default', function () {
  gulp.src("src/images/*.{jpg,png,jpeg}")
    .pipe(imageResize({
      width : '100%',
      quality : 0.5
    }))
    .pipe(gulp.dest('src/new_images'));
});



//Link con ejemplos y los valores predeterminados
//https://www.npmjs.com/package/gulp-autoprefixer
//https://www.npmjs.com/package/gulp-clean-css

 // Añadir los prefijos a los estilos para todos los navegadores
 // Además, minifica el css y lo renombra
gulp.task('autoprefixer', () =>
    gulp.src('css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCSS({compatibility: 'ie8'}))  
        .pipe(gp_rename('book.min.css'))  
        .pipe(gulp.dest('css/new'))
);


// pasar el jshint y ver qué errores tiene el js
gulp.task('lint', function() {
  return gulp.src('js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

//borrar carpetas, archivos, etc
gulp.task('borrar', function () {
    return gulp.src('paraborrar', {read: false})
        .pipe(clean());
});

// concatena archivos y los minifica. Hemos añadido ['autoprefixer',  'borrar'] para ejecutar 3 tareas sin tener que teclearlo.
gulp.task('trabajar',['autoprefixer', 'borrar','lint'], function(){
    return gulp.src(['js/*.js'])
        .pipe(gp_sourcemaps.init())
        .pipe(gp_concat('concat.min.js'))
        .pipe(gp_uglify())
        .pipe(gp_sourcemaps.write('./'))
        .pipe(gulp.dest('js/build'));
});