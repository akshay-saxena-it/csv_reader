const sensex = require('../model/sensex');

exports.socket = (io) => {
    io.on("connection", socket => {
        console.log('new connection')
        //getData
        socket.on('getData', req => {
            getData(req, io)
        })
        // addData
        socket.on('addData', data => {
            if (data) {
                sensex.create(data).then(result => {
                    getData({}, io)
                }).catch(err => {
                    console.log('err', err);
                })
            } else {
                console.log('data not provided');
            }
        })
    })
}
function getData(req, io) {
    let page = parseInt(req.page) || 0;
    let limit = parseInt(req.limit) || 30;
    sensex.find().sort({ date: '-1' })
        .skip(limit * page)
        .limit(limit)
        .exec((err, result) => {
            if (err) {
                console.log('Error in fetch data', err)
                io.emit('data', {})
            }
            sensex.countDocuments().exec((err, count) => {
                if (err) {
                    console.log('Error', err)
                    io.emit('data', {})
                }
                let total_page = Math.ceil((count / limit));
                io.emit('data', { data: result, pages: total_page, page })
            })
        })
}