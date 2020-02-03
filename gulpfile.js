const { parallel, series, src, dest, watch } = require('gulp')
const pug = require('gulp-pug')
const browserSync = require('browser-sync').create()

const less = require('gulp-less')
const miniCss = require('gulp-clean-css')
const dirTree = require('directory-tree')

const markdownToHtml = require('./build/gulp-markdown-to-html')


const globs = {
    pug: 'template/**/*.pug',
    less: 'template/less/*.less',
    img: 'template/img/*',
    markdown: 'docs/**/*.md'
}

let tree = []


function getTree(cb) {
    tree = dirTree('docs', { extensions: /\.md$/ }, (item, v, stats) => {
        if (item.type === 'file') {
            console.log(item.path)
            item.path = '/' + item.path.slice(0, -3) + '.html'
            item.name = item.name.slice(0, -3)
        }
    }).children
    console.log(tree)
    cb()
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


function markdownTask() {
    return src(globs.markdown).pipe(markdownToHtml({
        template: 'template/index.pug',
        tree
    })).pipe(dest('dist/docs'))
}


function lessTask() {
    return src(globs.less).pipe(less({}))
        .pipe(miniCss())
        .pipe(dest('dist/static/css/'))
}



function watchTask() {
    watch(globs.less, lessTask)
    watch(globs.markdown, markdownTask)
}


exports.default = parallel(getTree, series(markdownTask, lessTask, watchTask), server)