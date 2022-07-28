const { Type } = require('../models/models');
const ApiError = require('../error/ApiError');
const { unlink } = require('node:fs/promises');
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

    async patchType(req, res) {
        const { id, name } = req.body;
        const img = !!req.files?.img;

        let type;
        // If we didn't get a valid ID, so we catch it
        try {
            type = await Type.findOne({ where: { id }});
        } catch (e) {
            return res.json({ message: 'Invalid id' });
        }
        // No params
        if (!img && !name) {
            return res.json({ message: 'Invalid params' });
        }

        // Only 'Name' changing
        if (name && !img) {
            if (name !== type.name) {
                Type.update({ name }, { where: { id }});
            }
        }

        // 'Name' and 'Image' changing
        if (name && img) {
            if (type.img) {
                try {
                    await unlink(`/Users/user/main/OS/server/static/${type.img}`);
                } catch (e) {}
            }
            const fileName = uuid.v4() + '.jpg';
            req.files.img.mv(path.resolve(__dirname, '..', 'static', fileName));
            if (name !== type.name) {
                Type.update({ img: fileName, name }, { where: { id }});
            } else {
                Type.update({ img: fileName }, { where: { id }});
            }
        }

        // Only 'Image' changing
        if (req.files?.img && !name) {
            if (type.img) {
                try {
                    await unlink(`/Users/user/main/OS/server/static/${type.img}`);
                } catch (e) {}
            }
            const fileName = uuid.v4() + '.jpg';
            req.files.img.mv(path.resolve(__dirname, '..', 'static', fileName));
            Type.update({ img: fileName }, { where: { id }});
        }

        const types = await Type.findAll( { order: [['id', 'ASC']]});
        return res.json(types);
    };

    async deleteType(req, res) {
        const { id } = req.params;
        const deletableType = await Type.findOne({ where: { id }});

        if (deletableType) {
            await Type.destroy({ where: { id }});
        }
        if (deletableType?.img) {
            await unlink(`/Users/user/main/OS/server/static/${deletableType.img}`);
        }
        const types = await Type.findAll( { order: [['id', 'ASC']]});

        return res.json(types);
    };
}

module.exports = new TypeController;
