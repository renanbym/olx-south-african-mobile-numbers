const exec = require('child_process').exec;
const checkNumbers = require('../controllers/checkPhoneNumbers');
const fs = require('fs');

require('should');

describe('Numbers', () => {

    const validFile = 'valid-file.txt';
    const invalidFile = 'invalid-file.txt';
    const validInvalidFile = 'valid-invalid-file.txt';

    beforeEach(() => {
        fs.writeFile(validFile, "351960000000\n00351961111111\n351210000000\n35112\n244910000000", (err) => {
            if (err) throw err;
        });
        fs.writeFile(invalidFile, "+00112\n0012", (err) => {
            if (err) throw err;
        });
        fs.writeFile(validInvalidFile, "+00112\n0012\n351210000000\n244910000000", (err) => {
            if (err) throw err;
        });
    });


    afterEach(() => {
        fs.unlink(validFile, (err) => {
            if (err) throw err;
        });
        fs.unlink(invalidFile, (err) => {
            if (err) throw err;
        });
        fs.unlink(validInvalidFile, (err) => {
            if (err) throw err;
        });
    });

    describe('Controller', () => {

        it('Should return the valid phone numbers', () => {

            fs.readFile(validFile, 'utf8', (err, data) => {
                if (err) throw 'error loading file';
                const lines = data.split(/\r?\n/);
                const check = checkNumbers(lines);
                Number(check[0]['244']).should.be.equal(1);
                Number(check[1]['351']).should.be.equal(3);
            });
        });

        it('Should\'t return phone numbers, because the numbers are invalid', () => {

            fs.readFile(invalidFile, 'utf8', async (err, data) => {
                if (err) throw 'error loading file';
                const lines = data.split(/\r?\n/);
                const check = await checkNumbers(lines);
                Number(check.length).should.be.equal(0);
            });
        });


        it('Should return the only valid phone numbers', () => {

            fs.readFile(validInvalidFile, 'utf8', async (err, data) => {
                if (err) throw 'error loading file';
                const lines = data.split(/\r?\n/);
                const check = await checkNumbers(lines);
                Number(check[0]['244']).should.be.equal(1);
                Number(check[1]['351']).should.be.equal(1);
            });
        });

    })

    describe('CLI', () => {

        it('Should return the valid phone numbers', () => {

            exec(`tallkdesk-phone phones ./${validFile}`, (err, res) => {
                if (err) throw err;

                Number(res[0]['244']).should.be.equal(1);
                Number(res[1]['351']).should.be.equal(3);
            });

        });

        it('Should\'t return phone numbers, because the numbers are invalid', () => {
            exec(`tallkdesk-phone phones ./${invalidFile}`, (err, res) => {
                if (err) throw err;
                console.log(res);
                Number(res.length).should.be.equal(0);
            });
        });


        it('Should return the only valid phone numbers', () => {
            exec(`tallkdesk-phone phones ./${validInvalidFile}`, (err, res) => {
                if (err) throw 'error loading file';
                Number(res.length).should.be.equal(2);
                Number(res[0]['244']).should.be.equal(1);
                Number(res[1]['351']).should.be.equal(1);
            });
        });

    })


});