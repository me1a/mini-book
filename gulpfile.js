const { parallel, series, src, dest, watch } = require('gulp')
const pug = require('gulp-pug')
const browserSync = require('browser-sync').create()

const less = require('gulp-less')
const miniCss = require('gulp-clean-css')


const globs = {
    pug: 'template/**/*.pug',
    less: 'template/less/*.less',
    img: 'template/img/*'
}


function server() {
    browserSync.init({
        watch: true,
        port: 3007,
        server: {
            baseDir: 'dist/',
        },
        open: false
    })
}

function pugTask() {
    return src(globs.pug).pipe(pug({})).pipe(dest('dist'))
}

function lessTask() {
    return src(globs.less).pipe(less({}))
        .pipe(miniCss())
        .pipe(dest('dist/static/css/'))
}



function watchTask() {
    watch(globs.pug, pugTask)
    watch(globs.less, lessTask)
}



exports.default = parallel(series(pugTask, lessTask, watchTask), server)