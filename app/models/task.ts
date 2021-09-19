import mongoose from 'mongoose';
const { Schema } = mongoose;

const TaskS = new Schema({
    id: { type: Number, unique: true, sparse: true },
    name: { type: String, required: true, max: 60 },
    desc: { type: String, required: true, max: 255 }
});

const Task = mongoose.model('Task', TaskS);

export default Task;
