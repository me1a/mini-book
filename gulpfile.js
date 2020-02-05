const { parallel, series, src, dest, watch } = require('gulp')
const pug = require('gulp-pug')
const browserSync = require('browser-sync').create()

const less = require('gulp-less')
const miniCss = require('gulp-clean-css')
const dirTree = require('directory-tree')

const markdownToHtml = require('./build/gulp-markdown-to-html')


const globs = {
    doc: ['template/doc.pug', 'template/component/*.pug'],
    index: ['template/index.pug', 'template/component/*.pug'],
    less: 'template/less/**/*.less',
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
        template: 'template/doc.pug',
        tree
    })).pipe(dest('dist/docs'))
}


function lessTask() {
    return src(globs.less).pipe(less({}))
        .pipe(miniCss())
        .pipe(dest('dist/static/css/'))
}

function pugTask() {
    return src(globs.index).pipe(pug({
        locals: {
            tree
        }
    })).pipe(dest('dist/'))
}

function watchTask() {
    watch(globs.less, lessTask)
    watch([globs.markdown, ...globs.doc], markdownTask)
}


exports.default = parallel(getTree, series(pugTask, markdownTask, lessTask, watchTask), server)