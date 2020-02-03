const unified = require('unified')
const vfile = require('to-vfile')
const markdown = require('remark-parse')
const slug = require('remark-slug')
const toc = require('remark-toc')
const remark2rehype = require('remark-rehype')
const html = require('rehype-stringify')
const highlight = require('remark-highlight.js')
const rfm = require('remark-frontmatter')

const gfm = require('./parseFrontMatter')
const autoToc = require('./addToc')
const getDes = require('./getDes')
const mdStyle = require('./mdStyle')
const getTitle = require('./getTitle')

module.exports = function (markdownPath) {
  var processor = unified()
    .use(getDes)
    .use(highlight)
    .use(markdown)
    .use(autoToc)
    .use(rfm)
    .use(gfm)
    .use(slug)
    .use(toc, { tight: true, maxDepth: 2, heading: '目录' })
    .use(remark2rehype)
    .use(test)
    .use(mdStyle)
    .use(getTitle)
    .use(html)



  function test() {

    return function transformer(tree, file) {
      // console.dir(tree, { depth: 4 })
    }
  }

  const file = processor.processSync(vfile.readSync(markdownPath))
  return {
    doc: file.contents,
    description: file._description,
    search: file._search,
    title: file._h1,
    data: file._data ? file._data : {}
  }
}