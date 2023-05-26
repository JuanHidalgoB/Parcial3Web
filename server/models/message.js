import {mongoose} from 'mongoose';

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    message: Number
})

export default mongoose.model('Message', MessageSchema)