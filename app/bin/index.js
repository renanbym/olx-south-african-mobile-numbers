#! /usr/bin/env node
const cm = require('commander');
const fs = require('fs');
const Numbers = require('../models/Numbers');

cm
    .version('1.0.0')
    .description('Get valid numbers');

cm
    .command('phones <file>')
    .description('Olx\'s recruitment process')
    .action(file => readFile(file));

cm.parse(process.argv);

async function readFile(file) {

    fs.readFile(file, 'utf8', (err, data) => {
        if (err) return console.log('error loading file');
        const lines = data.split(/\r?\n/).reduce((acc, cur, idx) => {
            if (idx > 0) acc.push(cur.split(',')[1]);
            return acc;
        }, [])

        console.log(Numbers.getNumbers(lines));
    });

    return true;
}
