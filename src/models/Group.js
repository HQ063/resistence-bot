const mongoose = require('mongoose');

let groupSchema = mongoose.Schema({
    _id : Number,
    name: String,
    host : Object,
    users : Array
},{
    timestamps: true
});

export default mongoose.model('Group', groupSchema)
