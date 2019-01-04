# toy koa router

[![npm](http://img.shields.io/npm/v/toy-koa-router.svg?style=flat-square)](https://github.com/huhu2356/toy-koa-router)

## Installation

```bash
$ npm install toy-koa-router
```

### Example

```js

const Koa = require('koa');
const KoaRouter = require('toy-koa-router');

const app = new Koa();
const router = new KoaRouter();

router.get('/abc/:id',
    async (ctx, next) => {
        console.log(1);
        await next();
        console.log(3);
    },
    async (ctx, next) => {
        console.log(2);
        await next();
        console.log(4);
    }
);

app.use(router.routes());

app.use((ctx, next) => {
    console.log(5);
    ctx.body = 'nice';
});

app.listen(3000);

```

## License

MIT