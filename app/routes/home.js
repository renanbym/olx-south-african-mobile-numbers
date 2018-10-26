const multiparty = require('connect-multiparty');

const app = (app) => {

    const numbers = app.controllers.numbers

    app.route('/api/v1/numbers/check/file')
        .post(multiparty(), numbers.checkFile)

    app.route('/api/v1/numbers/check')
        .post(multiparty(), numbers.check)

}

module.exports = app;