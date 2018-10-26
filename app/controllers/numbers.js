const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const mime = require('mime-types')
const Numbers = require('../models/Numbers');
const { enumError } = require('../models/enums');

const numbers = (app) => ({

    checkFile: async (req, response) => {

        try {
            const { files } = req

            if (!files) {
                response.status(400).json({ "code": 400, "status": "error", "message": enumError.ERROR_LOADING });
                return;
            }

            const { file } = files
            if (!file) {
                response.status(400).json({ "code": 400, "status": "error", "message": enumError.ALL_FIELDS });
                return;
            }

            if (mime.lookup(file.path) != 'text/csv') {
                response.status(400).json({ "code": 400, "status": "error", "message": enumError.INVALID_TYPE });
                return;
            }

            const data = await readFile(file.path, 'utf8');

            if (!data) {
                response.status(400).json({ "code": 400, "status": "error", "message": enumError.ERROR_LOADING });
                return;
            }

            const splitFile = data.split(/\r?\n/);
          

            if (typeof splitFile[0] == 'undefined' || splitFile[0].toString().toLocaleLowerCase().trim() != 'id,sms_phone') throw new Error(enumError.INVALID_FORMAT);

            const lines = await splitFile.reduce((acc, cur, idx) => {
                if (idx > 0) {
                    const splitLine = cur.split(',');
                    if (splitLine.length != 2) throw new Error(enumError.CONTENT_FORMAT);
                    acc.push(splitLine[1]);
                }
                return acc;
            }, [])

            if (!lines.length) {
                response.status(400).json({ "code": 400, "status": "error", "message": enumError.CONTENT_FORMAT });
                return;
            }

            const content = Numbers.getNumbers(lines);

            response.status(200).json({ "code": 200, "status": "success", "result": content });
            
        } catch (e) {
            response.status(406).json({ "code": 406, "status": "error", "message": e.message })
        }


    },

    checkNumber: (req, response) => {

        try {
            const { number } = req.body;

            if (!number) response.status(400).json({ "code": 400, "status": "error", "message": enumError.ALL_FIELDS });

            const content = Numbers.getNumbers([number.toString()]);

            if (content.incorrected.length) response.status(400).json({ "code": 400, "status": "error", "message": content.incorrected[0].reason })

            response.status(200).json({ "code": 200, "status": "success", "result": content.corrected[0] })
        } catch (e) {
            response.status(406).json({ "code": 406, "status": "error", "message": e })
        }
    }


})

module.exports = numbers;