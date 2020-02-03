
const visit = require('unist-util-visit')

module.exports = function () {

  return function transformer(tree, file) {
    visit(tree, 'text', function (node) {
      if (file._description === undefined) {
        file._description = node.value
      } else {
        file._description = file._description.length > 200 ? file._description.slice(0, 200) + '...' : file._description + node.value
      }
    })
    let arr = []
    visit(tree, 'heading', function (node) {
      if (node.depth < 4) {

        function self(node) {
          let s = ''
          node.children.forEach(item => {

            s += item.value ? item.value : ''
            if (item.children) s += self(item)
          })
          return s
        }
        let sa = self(node)
        if (sa) arr.push({
          type: node.depth,
          value: sa.replace(/\s/g, '')
        })
      }
    })
    file._search = arr
  }
}