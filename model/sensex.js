
'use strict';
const mongoose = require('mongoose');


const sensexSchema = new mongoose.Schema({
    open: {
        type: Number
    },
    close: {
        type: Number
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('sensex', sensexSchema);