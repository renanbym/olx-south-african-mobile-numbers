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


const validFile = 'valid-file.csv';
const invalidFile = 'invalid-file.csv';
const validInvalidFile = 'valid-invalid-file.csv';

describe('API Numbers: ', () => {


    before((done) => {
        fs.writeFile(validFile, "id,sms_phone\n103426733,27736529279\n103425998,27827678672", (err) => {
            if (err) throw err;
        });
        fs.writeFile(invalidFile, "+id,sms_phone\n103266195,639156553262_DELETED_1486721886", (err) => {
            if (err) throw err;
        });
        fs.writeFile(validInvalidFile, "id,sms_phone\n103425998,27827678672\n103266195,639156553262_DELETED_1486721886", (err) => {
            if (err) throw err;
        });
        done();
    })

    after((done) => {
        fs.unlink(validFile, (err) => {
            if (err) throw err;
        });
        fs.unlink(invalidFile, (err) => {
            if (err) throw err;
        });
        fs.unlink(validInvalidFile, (err) => {
            if (err) throw err;
        });
        done();
    })

    describe('GET /numbers/check/file', (done) => {


        it('does not return the POST, because undefined fields', (done) => {
            let data = {}
            request(server)
                .post('/api/v1/numbers/check/file')
                .set('Content-Type', 'application/json')
                .send(data)
                .end((err, res) => {

                    res.statusCode.should.be.equal(401);
                    res.body.code.should.be.equal(401);
                    res.body.status.should.be.equal('error');
                    done();
                });
        });

        it('should be return the object with corrects mobile numbers', (done) => {

            request(server)
                .post('/api/v1/numbers/check/file')
                .attach('file', validFile)
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
                .attach('file', invalidFile)
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
                .attach('file', validInvalidFile)
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
                .set('Content-Type', 'application/json')
                .send(data)
                .end((err, res) => {

                    res.statusCode.should.be.equal(401);
                    res.body.code.should.be.equal(401);
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
                .set('Content-Type', 'application/json')
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
                .set('Content-Type', 'application/json')
                .send(data)
                .end((err, res) => {
                    res.statusCode.should.be.equal(401);
                    res.body.code.should.be.equal(401);
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
                .set('Content-Type', 'application/json')
                .send(data)
                .end((err, res) => {
                    res.statusCode.should.be.equal(401);
                    res.body.code.should.be.equal(401);
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
                .set('Content-Type', 'application/json')
                .send(data)
                .end((err, res) => {
                    res.statusCode.should.be.equal(401);
                    res.body.code.should.be.equal(401);
                    res.body.status.should.be.equal('error');
                    res.body.message.should.be.equal(enumError.COUNT_NUMBER);
                    done();
                });
        });

    })


});