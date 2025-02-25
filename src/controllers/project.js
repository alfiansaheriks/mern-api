const { validationResult } = require('express-validator');
const ProjectPost = require('../models/project');
const fs = require('fs');
const path = require('path');

exports.createProjectList = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const err = new Error('Input value tidak sesuai');
        err.errorStatus = 400;
        err.data = errors.array();
        throw err;
    }
    if (!req.file) {
        const err = new Error('Image harus di upload');
        err.errorStatus = 422;
        err.data = errors.array();
        throw err;
    }

    const name = req.body.name;
    const image = req.file.path;
    const desc = req.body.desc;

    const CreateProject = new ProjectPost({
        name: name,
        desc: desc,
        image: image,
        author: { uid: 1, name: 'Erik' }
    });

    CreateProject.save()
        .then(result => {
            res.status(201).json({
                message: 'Create Project Success',
                data: result
            });
        })
        .catch(err => {
            console.log('err: ', err);
            next(err);
        });
};


exports.getAllProject = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = req.query.perPage || 5;
    let totalItems;

    ProjectPost.find()
    .countDocuments()
    .then(count => {
        totalItems = count;
        return ProjectPost.find()
            .skip((currentPage -1) * perPage)
            .limit(perPage);
    })
    .then(result => {
        res.status(200).json({
            message: 'Data Project Berhasil Dipanggil',
            data:result,
            total_data: totalItems,
            per_page: perPage,
            current_page: currentPage,
        });
    })
    .catch(err => {
        next(err);
    })
};

exports.getProjectById = (req, res, next) => {
    const projectId = req.params.projectId;
    ProjectPost.findById(projectId)
        .then(result => {
            if(!result) {
                const error = new Error('Project tidak ditemukan');
                error.errorStatus = 404;
                throw error;
            }
            res.status(200).json({
                message: 'Project berhasil dipanggil',
                data: result,
            });
        })
        .catch(err => {
            next(err);
        });
};

exports.updateProjectPost = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const err = new Error('Input value tidak sesuai');
        err.errorStatus = 400;
        err.data = errors.array();
        throw err;
    }
    if(!req.file) {
        const err = new Error('Image harus di upload');
        err.errorStatus = 422;
        err.data = errors.array();
        throw err;
    }

    const name = req.body.name;
    const image = req.body.path;
    const desc = req.body.desc;
    const postId = req.params.projectId;

    ProjectPost.findById(postId)
    .then(post => {
        if(!post) {
            const err = new Error('Data Project tidak ditemukan');
            err.errorStatus = 404;
            throw err;
        }

        post.name = name;
        post.desc = desc;
        post.image = image;

        return post.save();
    })
    .then(result => {
        res.status(200).json({
            message: 'Update Sukses',
            data: result
        });
    })
    .catch(err => {
        next(err);
    });
};

exports.deleteProjectPost = (req, res, next) => {
    const postId = req.params.postId;

    getBlogPostById.findById(postId)
    .then(post => {
        if(!post) {
            const err = new Error('Data Project tidak ditemukan');
            err.errorStatus = 404;
            throw err;
        }

        removeImage(post.image);
        return getBlogPostById.findByIdAndDelete(postId);
    })
    .then(result => {
        res.status(200).json({
            message: 'Hapus Blog Post Berhasil',
            data: result,
        });
    })
    .catch(err => {
        next(err);
    });
};

const removeImage = (filePath) => {
    console.log('filepath', filePath);
    console.log('dir name: ', __dirname);

    filePath = path.join(__dirname, '../..', filePath);
    fs.unlink(filePath, err => console.log(err));
}