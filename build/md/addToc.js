module.exports = function () {
  return function transform(tree) {
    const toc = {
      type: 'heading',
      depth: 4,
      children: [{
        type: 'text',
        value: '目录'
      }]
    }

    const i = tree.children.findIndex(item => item.type === 'heading')
    if (i !== -1) {
      tree.children.splice(i + 1, 0, toc)
    } else {
      // tree.children.push(toc)
    }

  }
}