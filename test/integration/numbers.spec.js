process.env.NODE_ENV = 'test';

const path = require('path');
const fs = require('mz/fs');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const should = chai.should();
const request = require('supertest');
chai.use(chaiHttp);
const { enumError } = require(path.resolve('./') + '/app/models/enums');


const invalidFile = 'invalid-file.csv';
const invalidFile2 = 'invalid-file2.csv';

const correctFile = 'correct-file.csv';
const incorrectFile = 'incorrect-file.csv';
const correctAndIncorrectFile = 'correct-incorrect-file.csv';
describe('API Numbers: ', () => {


    before((done) => {
        fs.writeFile(invalidFile, "id,sms_phone\n27736529279\n27827678672", (err) => {
            if (err) throw err;
        });
        fs.writeFile(invalidFile2, "27736529279\n27827678672", (err) => {
            if (err) throw err;
        });
        fs.writeFile(correctFile, "id,sms_phone\n103426733,27736529279\n103425998,27827678672", (err) => {
            if (err) throw err;
        });
        fs.writeFile(incorrectFile, "id,sms_phone\n103266195,639156553262_DELETED_1486721886", (err) => {
            if (err) throw err;
        });
        fs.writeFile(correctAndIncorrectFile, "id,sms_phone\n103425998,27827678672\n103266195,639156553262_DELETED_1486721886", (err) => {
            if (err) throw err;
        });
        done();
    })

    after((done) => {
        fs.unlink(invalidFile, (err) => {
            if (err) throw err;
        });
        fs.unlink(invalidFile2, (err) => {
            if (err) throw err;
        });
        fs.unlink(correctFile, (err) => {
            if (err) throw err;
        });
        fs.unlink(incorrectFile, (err) => {
            if (err) throw err;
        });
        fs.unlink(correctAndIncorrectFile, (err) => {
            if (err) throw err;
        });
        done();
    })

    describe('GET /numbers/check/file', () => {


        it('does not return the POST, because undefined fields', (done) => {
            let data = {}
            request(server)
                .post('/api/v1/numbers/check/file')
                .send(data)
                .end((err, resp) => {
            
                    resp.statusCode.should.be.equal(400);
                    resp.body.code.should.be.equal(400);
                    resp.body.status.should.be.equal('error');

                    done();
                });
        });

        it('does not return the POST, because file is invalid', (done) => {

            request(server)
                .post('/api/v1/numbers/check/file')
                .attach('file', invalidFile)
                .end((err, res) => {

                    res.statusCode.should.be.equal(406);
                    res.body.code.should.be.equal(406);
                    res.body.status.should.be.equal('error');
                    res.body.message.should.be.equal(enumError.CONTENT_FORMAT);

                    done();
                });

        });

        it('does not return the POST, because file is invalid (2)', (done) => {

            request(server)
                .post('/api/v1/numbers/check/file')
                .attach('file', invalidFile2)
                .end((err, res) => {

                    res.statusCode.should.be.equal(406);
                    res.body.code.should.be.equal(406);
                    res.body.status.should.be.equal('error');

                    res.body.message.should.be.equal(enumError.INVALID_FORMAT);


                    done();
                });

        });

        it('should be return the object with corrects mobile numbers', (done) => {

            request(server)
                .post('/api/v1/numbers/check/file')
                .attach('file', correctFile)
                .end((err, res) => {

                    res.statusCode.should.be.equal(200);
                    res.body.code.should.be.equal(200);
                    res.body.status.should.be.equal('success');

                    res.body.result.corrected.length.should.be.equal(2);
                    res.body.result.incorrected.length.should.be.equal(0);

                    done();
                });

        });

        it('should be return the object with incorrects mobile numbers', (done) => {

            request(server)
                .post('/api/v1/numbers/check/file')
                .attach('file', incorrectFile)
                .end((err, res) => {
              
                    res.statusCode.should.be.equal(200);
                    res.body.code.should.be.equal(200);
                    res.body.status.should.be.equal('success');

                    res.body.result.corrected.length.should.be.equal(0);
                    res.body.result.incorrected.length.should.be.equal(1);

                    done();
                });

        });

        it('should be return the object with correts and incorrects mobile numbers', (done) => {

            request(server)
                .post('/api/v1/numbers/check/file')
                .attach('file', correctAndIncorrectFile)
                .end((err, res) => {

                    res.statusCode.should.be.equal(200);
                    res.body.code.should.be.equal(200);
                    res.body.status.should.be.equal('success');

                    res.body.result.corrected.length.should.be.equal(1);
                    res.body.result.incorrected.length.should.be.equal(1);

                    done();
                });

        });

    });


    describe('GET /number/check', (done) => {

        it('does not return the POST, because undefined fields', (done) => {
            const data = {
                num: 'dasdsa'
            }
            request(server)
                .post('/api/v1/numbers/check')
                .send(data)
                .end((err, res) => {

                    res.statusCode.should.be.equal(400);
                    res.body.code.should.be.equal(400);
                    res.body.status.should.be.equal('error');
                    done();
                });
        });

        it('should be return the corret mobile number', (done) => {

            const data = {
                number: 27849790100
            }
            request(server)
                .post('/api/v1/numbers/check')
                .send(data)
                .end((err, res) => {

                    res.statusCode.should.be.equal(200);
                    res.body.code.should.be.equal(200);
                    res.body.status.should.be.equal('success');
                    res.body.result.phone.should.be.equal('27 84 979 0100');
                    done();
                });
        });

        it('should be return the incorrect mobile number, because have string with number', (done) => {

            let data = {
                number: '_DELETE_27213910052'
            }
            request(server)
                .post('/api/v1/numbers/check')
                .send(data)
                .end((err, res) => {
                    res.statusCode.should.be.equal(400);
                    res.body.code.should.be.equal(400);
                    res.body.status.should.be.equal('error');
                    res.body.message.should.be.equal(enumError.ONLY_NUMBER);
                    done();
                });
        });

        it('should be return the incorrect mobile number, because the begin of the number is different of 27', (done) => {
            let data = {
                number: 55849790100
            }
            request(server)
                .post('/api/v1/numbers/check')
                .send(data)
                .end((err, res) => {
                    res.statusCode.should.be.equal(400);
                    res.body.code.should.be.equal(400);
                    res.body.status.should.be.equal('error');
                    res.body.message.should.be.equal(enumError.BEGIN_NUMBER);
                    done();
                });
        });

        it('should be return the incorrect mobile number, because begin total of number is different of 11', (done) => {
            let data = {
                number: 2721391005212
            }
            request(server)
                .post('/api/v1/numbers/check')
                .send(data)
                .end((err, res) => {
                    res.statusCode.should.be.equal(400);
                    res.body.code.should.be.equal(400);
                    res.body.status.should.be.equal('error');
                    res.body.message.should.be.equal(enumError.COUNT_NUMBER);
                    done();
                });
        });

    })


});