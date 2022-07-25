const { Type } = require('../models/models');
const ApiError = require('../error/ApiError');
const { unlink }  = require('node:fs/promises');
const uuid = require('uuid');
const path = require('path');

class TypeController {

    async createType(req, res) {
        const { name } = req.body;
        const { img } = req.files;
        let fileName = uuid.v4() + '.jpg';
        img.mv(path.resolve(__dirname, '..', 'static', fileName));

        const type = await Type.create({ name, img: fileName });
        return res.json(type);
    };

    async getAllTypes(req, res){
        const types = await Type.findAll( { order: [['id', 'ASC']]});
        return res.json(types);
    };

    async patchType (req, res) {
        const { id, name } = req.body;
        let type;

        // If we didn't get a valid ID, so we catch it
        try {
            type = await Type.findOne({ where: { id }});
        } catch (e) {
            return res.json({ message: 'Invalid Id' });
        }

        // No params
        if (!req.files?.img && !name) {
            return res.json({ message: 'Invalid params' });
        }

        // Only 'Name' changing
        if (name !== type.name && name && !req.files?.img) {
            const newType = await Type.update({ name }, { where: { id }});

            return res.json({ newType });
        }

        // 'Name' and 'Image' changing
        if (name !== type.name && name && req.files?.img) {
            if (type.img) {
                await unlink(`/Users/user/main/OS/server/static/${type.img}`);
            }
            const fileName = uuid.v4() + '.jpg';
            req.files.img.mv(path.resolve(__dirname, '..', 'static', fileName));
            const newType = await Type.update({ img: fileName, name }, { where: { id }});

            return res.json({ newType });
        }
        // Only 'Image' changing
        if (req.files?.img && !name) {
            if (type.img) {
                await unlink(`/Users/user/main/OS/server/static/${type.img}`);
            }
            const fileName = uuid.v4() + '.jpg';
            req.files.img.mv(path.resolve(__dirname, '..', 'static', fileName));
            const newType = await Type.update({ img: fileName }, { where: { id }});

            return res.json({ newType });
        }
    };
}

module.exports = new TypeController
