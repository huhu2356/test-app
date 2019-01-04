const methods = require('methods');
const compose = require('koa-compose');
const Layer = require('./layer');

class Router {
    constructor() {
        this.stack = [];
    }

    register(path, method, middlewares) {
        const layer = new Layer(path, method, middlewares);
        this.stack.push(layer);
    }

    routes() {
        const router = this;

        const dispatch = (ctx, next) => {
            const path = ctx.path;
            const matched = router.match(path, ctx.method);

            if (!matched.route) return next();

            const matchedLayers = matched.pathAndMethod;
            const layerChain = matchedLayers.reduce((acc, layer) => {
                acc.push((ctx, next) => {
                    ctx.captures = layer.captures(path);
                    ctx.params = layer.params(ctx.captures, ctx.params);
                    return next();
                });

                return acc.concat(layer.stack);
            }, []);

            return compose(layerChain)(ctx, next);
        };

        return dispatch;
    }

    match(path, method) {
        const layers = this.stack;
        const matched = {
            pathAndMethod: [],
            route: false
        };

        layers
            .filter(e => e.match(path) && e.method === method)
            .forEach(e => {
                matched.pathAndMethod.push(e);
                matched.route = true;
            });

        return matched;
    }
}

methods.forEach(method => {
    Router.prototype[method] = function(path, ...middlewares) {
        this.register(path, method, middlewares);
    };
});

module.exports = Router;
