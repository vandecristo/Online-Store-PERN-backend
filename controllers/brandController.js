const { Brand } = require('../models/models');
const ApiError = require('../error/ApiError');
const { unlink } = require('node:fs/promises');
const uuid = require('uuid');
const path = require('path');

class BrandController {
    async createBrand(req, res) {
        const { name } = req.body;
        const { img } = req.files;
        let fileName = uuid.v4() + '.jpg';
        img.mv(path.resolve(__dirname, '..', 'static', fileName));
        const brand = await Brand.create({ name, img: fileName });

        return res.json(brand);
    };

    async getAllBrands(req, res) {
        const brands = await Brand.findAll( { order: [['id', 'ASC']]});
        return res.json(brands);
    };

    async patchBrand(req, res) {
        const { id, name } = req.body;
        let brand;

        // If we didn't get a valid ID, so we catch it
        try {
            brand = await Brand.findOne({ where: { id }});
        } catch (e) {
            return res.json({ message: 'Invalid id' });
        }

        // No params
        if (!req.files?.img && !name) {
            return res.json({ message: 'Invalid params' });
        }

        // Only 'Name' changing
        if (name !== brand.name && name && !req.files?.img) {
            const updatedBrand = await Brand.update({ name }, { where: { id }});

            return res.json({ updatedBrand });
        }

        // 'Name' and 'Image' changing
        if (name !== brand.name && name && req.files?.img) {
            if (brand.img) {
                await unlink(`/Users/user/main/OS/server/static/${brand.img}`);
            }
            const fileName = uuid.v4() + '.jpg';
            req.files.img.mv(path.resolve(__dirname, '..', 'static', fileName));
            const updatedBrand = await Brand.update({ img: fileName, name }, { where: { id }});

            return res.json({ updatedBrand });
        }

        // Only 'Image' changing
        if (req.files?.img && !name) {
            if (brand.img) {
                await unlink(`/Users/user/main/OS/server/static/${brand.img}`);
            }
            const fileName = uuid.v4() + '.jpg';
            req.files.img.mv(path.resolve(__dirname, '..', 'static', fileName));
            const updatedBrand = await Brand.update({ img: fileName }, { where: { id }});

            return res.json({ updatedBrand });
        }
    };

    async deleteBrand (req, res) {
        const { id } = req.params;
        const deletableBrand = await Brand.findOne({ where: { id }});

        if (deletableBrand) {
            await Brand.destroy({ where: { id }});
        }
        if (deletableBrand?.img) {
            await unlink(`/Users/user/main/OS/server/static/${deletableBrand.img}`);
        }
        const brands = await Brand.findAll( { order: [['id', 'ASC']]});

        return res.json(brands);
    };
}

module.exports = new BrandController;
