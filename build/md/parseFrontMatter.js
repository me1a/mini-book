// 获取文档开头的FrontMatter
const visit = require('unist-util-visit')
module.exports = function getFrontMatter() {
  return function transformer(tree, data) {
    visit(tree, 'yaml', function (node) {
      const obj = {}
      const arr = node.value.split('\n')
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i]
        const j = item.indexOf(':')
        const k = item.slice(0, j).trim()
        const v = item.slice(j + 1).trim()
        if (k === '' || v === '') continue
        if (k && v && (/\{.*\}/.test(v) || /\[.*\]/.test(v))) {
          const val = new Function(`return ${v}`)()
          obj[k] = val
        } else {
          obj[k] = v
        }
      }
      data._data = obj
    })
  }
}