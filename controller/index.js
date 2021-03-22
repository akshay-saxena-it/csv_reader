'use strict';
const csv = require('csv-parser');
const fs = require('fs');
const sensex = require('../model/sensex');


exports.uploadCsv = (req, res) => {
    try {
        fs.createReadStream(process.cwd() + '/assets/Sensex_CSV.csv')
            .pipe(csv())
            .on('data', (row) => {
                counter++
                let data = {
                    'open': row.Open,
                    'close': row.Close,
                    'date': row.Date
                }
                let sensexData = new sensex(data);
                sensexData.save((err, result) => {
                    if (err) {
                        console.log('error', err)
                    }
                })
            })
            .on('end', () => {
                console.log('CSV file successfully processed');
                res.status(200).send({
                    statusCode: 200,
                    msg: 'CSV data is uploaded'
                });
            })

    } catch (e) {
        console.log('Error in uploading', err)
        res.status(500).send('Internal server Error')
    }
}

exports.getData = (req, res) => {
    return sensex.find((err, result) => {
        if (err) {
            console.log('Error in fetch data', err)
            return res.status(500).send('Internal Server Error')
        }
        res.status(200).send({ 'statusCode': 200, data: result })
    })
}