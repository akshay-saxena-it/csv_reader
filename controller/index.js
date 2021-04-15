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
exports.getData = async (req, res) => {
    let page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 30;

    return sensex.find().sort({ date: '-1' })
        .skip(limit * page)
        .limit(limit)
        .exec((err, result) => {
            if (err) {
                console.log('Error in fetch data', err)
                return res.status(500).send('Internal Server Error')
            }
            sensex.countDocuments().exec((err, count) => {
                if (err) {
                    return res.status(500).send('Internal Server Error');
                }
                let total_page = Math.ceil((count / limit));
                res.status(200).send({ 'statusCode': 200, result: { data: result, pages: total_page, page } })
            })
        })
}
exports.create = (req, res) => {
    if (req.body) {
        return sensex.create(req.body).then(data => {
            res.status(200).send({ statusCode: 200, msg: 'Successfully saved', data })
        }).catch(err => {
            console.log('err', err);
            res.status(500).send('Internal server Error');
        })
    } else {
        res.status(400).send({ 'statusCode': 400, msg: 'Please provide data' })
    }
}