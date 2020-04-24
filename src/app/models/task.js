// Conectando com o banco de dados
const mongoose = require('../../database');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    // tarefa pertence a um project
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        require: true,
    },
    // Uma tarefa contém um usuario
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    // se a tarefa foi completada ou não
    completed: {
        type: Boolean,
        require: true,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;