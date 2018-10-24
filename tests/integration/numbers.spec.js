const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src');
const should = chai.should();
chai.use(chaiHttp);


describe('Numbers ', () => {

    beforeEach((done) => {

    });

    describe('/GET /numbers/check', (done) => {

        it('does not return the POST, because undefined fields', (done) => {

            let participante = {
                nome: 'Renan Mariano'
            }

            chai.request(server)
                .post('/api/participantes')
                .send(participante)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.status.should.be.equal('error');
                    res.body.message.should.be.a('object');
                    res.body.message.should.have.property('email');
                    res.body.message.email.should.have.property('kind').eql('required');
                    done();
                });

        });

    });


    describe('/GET /number/check', (done) => {

        it('does not return the POST, because undefined fields', (done) => {

            let participante = {
                nome: 'Renan Mariano'
            }

            chai.request(server)
                .post('/api/participantes')
                .send(participante)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.status.should.be.equal('error');
                    res.body.message.should.be.a('object');
                    res.body.message.should.have.property('email');
                    res.body.message.email.should.have.property('kind').eql('required');
                    done();
                });

        });

    })


});