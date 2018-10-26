const fs = require('fs');
const mime = require('mime-types')
const Numbers = require('../models/Numbers');

const numbers = (app) => ({

    checkFile: (req, res) => {
        res.setHeader('Content-Type', 'application/json');

        const { files } = req

        if (!files) res.status(401).json({ "code": 401, "status": "error", "message": 'error loading file' });

        const { file } = files
        if (!files) res.status(401).json({ "code": 401, "status": "error", "message": 'all de fields are required' });

        if (mime.lookup(file.path) != 'text/csv') res.status(401).json({ "code": 401, "status": "error", "message": 'invalid file' });

        fs.readFile(file.path, 'utf8', (err, data) => {

            if (err) res.status(401).json({ "code": 401, "status": "error", "message": 'error loading file' });

            const lines = data.split(/\r?\n/).reduce((acc, cur, idx) => {
                if (idx > 0) acc.push(cur.split(',')[1]);
                return acc;
            }, [])

            const content = Numbers.getNumbers(lines);

            res.status(200).json({ "code": 200, "status": "success", "result": content })
        });

    },

    check: (req, res) => {
        res.setHeader('Content-Type', 'application/json');

        const { number } = req.body;

        if (!number) res.status(401).json({ "code": 401, "status": "error", "message": 'all de fields are required' });

        const content = Numbers.getNumbers([number.toString()]);

        if (content.incorrected.length) res.status(401).json({ "code": 401, "status": "error", "message": content.incorrected[0].reason })

        res.status(200).json({ "code": 200, "status": "success", "result": content.corrected[0] })
    }


})

module.exports = numbers;