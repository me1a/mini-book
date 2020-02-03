// 给代码添加mac窗口  表格添加样式
module.exports = function () {
  return function transformer(tree, data) {
    const children = tree.children
    tree.children = children.map((item, key) => {

      if (item.type === 'element' && item.tagName === 'pre') {
        if (Array.isArray(item.children) && item.children[0].tagName === 'code') {
          const c = item.children[0].properties.className
          item.children[0].properties.className = Array.isArray(c) ? c.includes('hljs') ? c : [...c, 'hljs', 'language-bash'] : ['hljs', 'language-bash']
          return {
            type: 'element',
            tagName: 'div',
            properties: { className: ['code-box'] },
            children: [
              {
                type: 'element', tagName: 'div', properties: { className: ['code-box-control'] }, children: [
                  { type: 'element', tagName: 'span', properties: { className: ['code-box-control-close'] } },
                  { type: 'element', tagName: 'span', properties: { className: ['code-box-control-min'] } },
                  { type: 'element', tagName: 'span', properties: { className: ['code-box-control-max'] } }
                ]
              },
              item
            ]
          }
        }
      } else if (item.type === 'element' && item.tagName === 'table') {
        item.properties.className = ['table', 'table-bordered']

        const th = item.children
          .filter(i => i.tagName === 'thead')[0].children
          .filter(i => i.tagName === 'tr')[0].children
          .filter(i => i.tagName === 'th')
          .map(i => i.children[0].value)

        let c = 0
        item.children = JSON.parse(JSON.stringify(item.children).replace(/\"td\"\,\"properties\"\:\{/g, (str) => {
          str += `"data-title":"${th[c % th.length]}",`
          c++
          return str
        }))

        return {
          type: 'element',
          tagName: 'div',
          properties: { className: ['table-responsive-vertical', 'shadow-z-1'] },
          children: [
            item
          ]
        }
      }
      return item
    })
  }
}