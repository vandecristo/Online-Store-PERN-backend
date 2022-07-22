const { Type, Device, DeviceInfo } = require('../models/models');
const ApiError = require('../error/ApiError');
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
        const types = await Type.findAll( { order: [
            ['id', 'ASC']]}
        );
        return res.json(types);
    };

    async patchType (req, res) {
        const { id } = req.body;
        const { img } = req.files;

        const type = await Type.findOne({ where: { id }});

        if (type.img) {
            //If we have previous picture, we should remove them from static
        } else {
            let fileName = uuid.v4() + '.jpg';
            img.mv(path.resolve(__dirname, '..', 'static', fileName));
            const type = await Type.update({ img: fileName }, { where: { id }});

            return res.json(type);
        }
    };
}

module.exports = new TypeController