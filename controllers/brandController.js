const { Brand, Type} = require('../models/models');
const ApiError = require('../error/ApiError');
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
        const brands = await Brand.findAll();
        res.json(brands);
    };

    async patchType(req, res) {
        const { id } = req.body;
        const { img } = req.files;

        const brand = await Brand.findOne({ where: { id }});

        if (brand.img) {
            //If we have previous picture, we should remove them from static
        } else {
            let fileName = uuid.v4() + '.jpg';
            img.mv(path.resolve(__dirname, '..', 'static', fileName));
            const brand = await Brand.update({ img: fileName }, { where: { id }});

            return res.json(brand);
        }
    };
}

module.exports = new BrandController