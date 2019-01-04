const pathToRegExp = require('path-to-regexp');

class Layer {
    constructor(path, method, middlewares) {
        this.path = path;
        this.stack = middlewares;
        this.method = method.toUpperCase();
        this.paramNames = [];
        this.regexp = pathToRegExp(path, this.paramNames);
    }

    match(path) {
        return this.regexp.test(path);
    }

    captures(path) {
        return path.match(this.regexp).slice(1);
    }

    params(captures, existingParams) {
        const params = captures.reduce((acc, cur, i) => {
            acc[this.paramNames[i].name] = cur;
            return acc;
        }, existingParams || {});

        return params;
    }
}

module.exports = Layer;
