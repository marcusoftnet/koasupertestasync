const Koa = require('koa')
const app = new Koa()
const routes = require('koa-route')

const monk = require('monk')
const db = monk('localhost/usersApi')

app.use(routes.get('/user/:id', async (ctx, id) => {
  const users = db.get('users')
  const user = await users.findOne({_id: id})
  ctx.body = user
  ctx.status = 200
}))

if (!module.parent) { app.listen(3000) }

module.exports = {
  app
}
