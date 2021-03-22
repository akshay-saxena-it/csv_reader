'use strict';
const csv = require('csv-parser');
const fs = require('fs');


exports.uploadCsv = (req, res) => {
    console.log('process.cwd();', process.cwd() + '/assets/Sensex_CSV.csv')
    fs.createReadStream(process.cwd() + '/assets/Sensex_CSV.csv')
        .pipe(csv())
        .on('data', (row) => {
            console.log(row);
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
        })
    res.status(200).send({
        statusCode: 200,
        msg: 'CSV data is uploaded'
    });
}