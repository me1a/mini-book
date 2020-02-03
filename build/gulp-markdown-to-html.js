const through = require('through2');
const PluginError = require('plugin-error');
const pug = require('pug')

const md2obj = require('./md')

module.exports = (options = {}) => {
  return through.obj(async (file, encoding, callback) => {
    if (file.isNull()) {
      callback(null, file);
      return;
    }

    try {
      const obj = md2obj(file.path)
      const name = file.path.slice(process.cwd().length, -3)
      const url = name + '.html'
      const compiledFunction = pug.compileFile(options.template)
      const str = compiledFunction({
        ...obj,
        tree: options.tree
      })

      options.visit && options.visit({
        url,
        ...obj
      })
      file.contents = Buffer.from(str);
      file.extname = '.html'
      callback(null, file);
    } catch (error) {
      callback(new PluginError('gulp-markdown-to-html', error, { fileName: file.path }));
    }
  });
};