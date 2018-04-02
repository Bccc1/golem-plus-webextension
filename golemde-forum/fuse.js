const { src, task, exec, context } = require("fuse-box/sparky");
const { FuseBox, QuantumPlugin, WebIndexPlugin } = require("fuse-box");
const concat = require('concat-files');

context(
  class {
  getConfig() {
    return FuseBox.init({
        homeDir : "src",
        target : 'browser@es5',
        output : "dist/$name.js", //output : isProduction ? "../$name.js" : "dist/$name.js",
        plugins : [
            WebIndexPlugin(),
            this.isProduction && QuantumPlugin()
        ]
    });
  }
}
);

task("default", async context => {
  const fuse = context.getConfig();
  fuse.dev(); // launch http server
  fuse.bundle("golemde-forum")
      .watch()
      .instructions(" > index.js");

  await fuse.run()
});

task("dist", async context => {
  context.isProduction = true;
  const fuse = context.getConfig();
  fuse.bundle("golemde-forum")
      .instructions(">index.js");

  await fuse.run()

  concat([
    './src/golemde-forum.meta.js',
    './dist/golemde-forum.js'
  ], './dist/golemde-forum.user.js', function(err) {
    if (err) throw err
    console.log('done');
  });
});