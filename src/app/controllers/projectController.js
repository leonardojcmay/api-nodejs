const express = require('express');
const authMiddleware = require('../middlewares/auth');

const Project = require('../models/project');
const Task = require('../models/task');

const router = express.Router();

router.use(authMiddleware);

// Rota de listar todos
router.get('/', async (req, res) => {
    try {
        // Listando todos os projetos e tambem os dados dos usuarios que o criou
        const projects = await Project.find().populate(['user', 'tasks']);

        return res.send({ projects });
    } catch (err) {
        return res.status(400).send({ error: 'Error loading projects' });
    }
});

// Rota de listar por id
router.get('/:projectId', async (req, res) => {
    try {
        // Listando o projeto solicitado no id e tambem os dados dos usuarios que o criou
        const project = await Project.findById(req.params.projectId).populate(['user', 'tasks']);

        return res.send({ project });
    } catch (err) {
        return res.status(400).send({ error: 'Error loading project' });
    }
});

// Rota para cadastrar um project
router.post('/', async (req, res) => {
    try {
        const { title, description, tasks } = req.body;

        // retornando o projeto e user que fex o cadastro
        const project = await Project.create({ title, description, user: req.userId });

        // percorrendo todas as tasks
        // utilizando o Promise.all fazendo com que faça esse async antes do await project.save()
        await Promise.all(tasks.map(async task => {
            // criando as tasks
            // new Task: cria mas não salva / Task.create : cria e ja salva
            const projectTask = new Task({ ...task, project: project._id })

            // salvando a task
            await projectTask.save();

            project.tasks.push(projectTask);

        }));

        // atualizando as tasks no banco de dados
        await project.save();

        return res.send({ project });
    } catch (err) {
        return res.status(400).send({ error: 'Error creating new project' });
    }
})

// Rota de atualizar um projeto
router.put('/:projectId', async (req, res) => {
    try {
        const { title, description, tasks } = req.body;

        // retornando o projeto e user que fex o cadastro
        const project = await Project.findByIdAndUpdate(req.params.projectId, {
            title,
            description
        }, { new: true }); // o new : true ira fazer com que retorne o valor atualizado

        // deletando as tasks associadas a este projeto antes de criar elas novamente
        project.tasks = [];
        await Task.deleteMany({ project: project._id });

        // percorrendo todas as tasks
        // utilizando o Promise.all fazendo com que faça esse async antes do await project.save()
        await Promise.all(tasks.map(async task => {
            // criando as tasks
            // new Task: cria mas não salva / Task.create : cria e ja salva
            const projectTask = new Task({ ...task, project: project._id })

            // salvando a task
            await projectTask.save();

            project.tasks.push(projectTask);

        }));

        // atualizando as tasks no banco de dados
        await project.save();

        return res.send({ project });
    } catch (err) {
        return res.status(400).send({ error: 'Error updating new project' });
    }
});

// Rota de deletar um projeto
router.delete('/:projectId', async (req, res) => {
    try {
        // Removendo o projeto solicitado no id
        const project = await Project.findByIdAndRemove(req.params.projectId);

        return res.send();
    } catch (err) {
        return res.status(400).send({ error: 'Error deleting project' });
    }
});

module.exports = app => app.use('/projects', router);