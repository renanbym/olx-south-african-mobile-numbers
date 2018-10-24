const app = (app) => {

    const numbers = app.controllers.numbers

    app.route('/api/v1/numbers/check')
        .post(numbers.check)

    app.route('/api/v1/number/check')
        .post(numbers.check)

}

export default app;