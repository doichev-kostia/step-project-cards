let project_folder = './dist';
let source_folder = './src';


let paths = {
    build: {
        html: "./index.html",
        css: project_folder + "/css/",
        img: project_folder + "/",
        fonts: project_folder + "/fonts/",
    },
    src: {
        html: "./index.html",
        scss: source_folder + "/**/*.scss",
        img: source_folder + "/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts: source_folder + "/fonts/**/*.{ttf,eot,svg,woff,woff2}",
    },
    watch: {
        html: "./index.html",
        js: "./js/**/*.js",
        scss: source_folder + "/**/*.scss",
        img: source_folder + "/**/*.{jpg,png,svg,gif,ico,webp}",
    },
    clean: project_folder
}

let {src, dest} = require('gulp'),
    gulp = require('gulp'),
    concat = require("gulp-concat"),
    browsersync = require("browser-sync").create(),
    del = require('del'),
    scss = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cleancss = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin');


scss.compiler = require("node-sass");

/*** FUNCTIONS ***/

function clean() {
    return del(paths.clean);
}

function fonts() {
    return gulp.src(paths.src.fonts)
        .pipe(gulp.dest(paths.build.fonts))
}


function css() {
    return src(paths.src.scss, {allowEmpty: true})
        .pipe(
            scss({
                outputStyle: "expanded"
            })
        )
        .pipe(scss().on("error", scss.logError))
        .pipe(concat("index.min.css"))
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 5 versions"],
                cascade: true
            })
        )
        .pipe(cleancss())
        .pipe(dest(paths.build.css))
        .pipe(browsersync.stream())
}


function images() {
    return src(paths.src.img)
        .pipe(
            imagemin({
                interlaced: true,
                progressive: true,
                optimizationLevel: 5,
                svgoPlugins: [
                    {
                        removeViewBox: true
                    }
                ]
            })
        )
        .pipe(dest(paths.build.img))
        .pipe(browsersync.stream())
}

let build = gulp.series(css);

function browserSync() {
    browsersync.init({
        server: {
            baseDir: "./"
        },
        port: 3000,
        notify: false
    })
    gulp.watch(paths.watch.js).on("change", browsersync.reload)
    gulp.watch(paths.src.scss, css).on("change", browsersync.reload)
    gulp.watch(paths.src.img, images).on("change", browsersync.reload)
    gulp.watch(paths.src.html, build).on("change", browsersync.reload)

}

gulp.task("default", gulp.series(clean, fonts, gulp.parallel(build, images), browserSync))
