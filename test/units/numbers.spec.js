const { getNumbers } = require('../../app/models/Numbers');
const chai = require('chai');
const should = chai.should();

const validFile = ['27736529279', '27827678672'];
const invalidFile = ['639156553262_DELETED_1486721886'];
const validInvalidFile = ['27827678672', '639156553262_DELETED_1486721886'];


describe('Models Numbers:', () => {

    it('should be return the object with correts mobile numbers', (done) => {
        const content = getNumbers(validFile);
        content.corrected.length.should.be.equal(2);
        content.incorrected.length.should.be.equal(0);

        done();

    });

    it('should be return the object with incorrects mobile numbers', (done) => {

        const content = getNumbers(invalidFile);

        content.corrected.length.should.be.equal(0);
        content.incorrected.length.should.be.equal(1);

        done();
    });

    it('should be return the object with correts and incorrects mobile numbers', (done) => {
        const content = getNumbers(validInvalidFile);

        content.corrected.length.should.be.equal(1);
        content.incorrected.length.should.be.equal(1);

        done();

    });

})
