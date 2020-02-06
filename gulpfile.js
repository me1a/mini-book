const { parallel, series, src, dest, watch } = require('gulp')
const pug = require('gulp-pug')
const browserSync = require('browser-sync').create()
const clean = require('gulp-clean')

const less = require('gulp-less')
const miniCss = require('gulp-clean-css')
const dirTree = require('directory-tree')
const image = require('gulp-imagemin')

const markdownToHtml = require('./build/gulp-markdown-to-html')
const md2obj = require('./build/md/index')


const globs = {
    doc: ['template/doc.pug', 'template/component/*.pug'],
    index: ['template/index.pug', 'template/component/*.pug'],
    less: 'template/less/**/*.less',
    img: 'template/img/**/*.*',
    markdown: 'docs/**/*.md'
}

let tree = []
let search = []

function cleanTask() {
    return src('dist/*').pipe(clean())
}


function imageTask() {
    return src(globs.img).pipe(image([
        image.optipng({ optimizationLevel: 5 })
    ])).pipe(dest('dist/static/img'))
}

function getTree(cb) {
    tree = dirTree('docs', { extensions: /\.md$/ }, (item, v, stats) => {
        if (item.type === 'file') {
            const obj = md2obj(`${item.path}`)
            const url = '/' + item.path.slice(0, -3) + '.html'
            item.path = url
            obj._url = url
            // item.name = item.name.slice(0, -3)
            item.name = obj._title


            if (!search.some(i => obj._search.some(j => i.title === j.value) && i.url === url)) {
                obj._search.forEach(i => {
                    search.push({ title: i.value, url, type: i.type })
                })
            }
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
        tree,
        search
    })).pipe(dest('dist/docs'))
}


function lessTask() {
    return src(globs.less).pipe(less({}))
        .pipe(miniCss())
        .pipe(dest('dist/static/css/'))
}

function pugTask() {
    return src(globs.index[0]).pipe(pug({
        locals: {
            tree,
            search,
        }
    })).pipe(dest('dist/'))
}

function watchTask(cb) {
    watch(globs.less, lessTask)
    watch([globs.markdown, ...globs.doc], markdownTask)
    watch(globs.index, pugTask)
    cb()
}

exports.clean = cleanTask
exports.default = series(cleanTask, getTree, parallel(pugTask, imageTask, markdownTask, lessTask), watchTask, server)
exports.build = series(cleanTask, getTree, parallel(pugTask, imageTask, markdownTask, lessTask))
exports.img = imageTask