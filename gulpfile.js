const { parallel, series, task, src, dest, watch } = require('gulp')
const pug = require('gulp-pug')
const browserSync = require('browser-sync').create()


const globs = {
    pug: 'template/**/*.pug',
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



function watchTask() {
    watch(globs.pug, pugTask)
}



exports.default = parallel(pugTask, watchTask, server)