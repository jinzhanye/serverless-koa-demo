const Koa = require('koa')
const KoaRouter = require('@koa/router')
const multer = require('@koa/multer')
const sendFile = require('koa-sendfile')
const path = require('path')
const fs = require('fs')
const mime = require('mime')
const staticServe = require('koa-static')

const isServerless = process.env.SERVERLESS
const app = new Koa()
const router = new KoaRouter()
const upload = multer({ dest: isServerless ? '/tmp/upload' : './upload' })

// or use absolute paths
app.use(staticServe(__dirname + '/static'))

router.get(`/`, async (ctx) => {
  await sendFile(ctx, path.join(__dirname, 'index.html'))
})

router.post('/upload', upload.single('file'), (ctx) => {
  ctx.body = {
    success: true,
    data: ctx.file
  }
})

router.get('/image', (ctx) => {
  const filePath = path.join(__dirname, './static/luobo-avatar.jpg');
  const file = fs.readFileSync(filePath); //读取文件

  let mimeType = mime.getType(filePath); //读取图片文件类型
  ctx.set('content-type', mimeType); //设置返回类型
  ctx.set('Content-disposition', 'attachment; filename=' + 'luobo-avatar.jpg');// 设置浏览器以附件的形式下载并保存到本地
  ctx.body = file; //返回图片
})

app.use(router.routes()).use(router.allowedMethods())

if (isServerless) {
  module.exports = app
} else {
  app.listen(3010, () => {
    console.log(`Server start on http://localhost:3010`)
  })
}
