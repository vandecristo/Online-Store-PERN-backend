const { Device, DeviceInfo } = require('../models/models');
const ApiError = require('../error/ApiError');
const { unlink } = require('node:fs/promises');
const uuid = require('uuid');
const path = require('path');

class DeviceController {
    async createDevice(req, res, next) {
        try {
            let { name, price, brandId, typeId, info } = req.body;
            const { img } = req.files;
            let fileName = uuid.v4() + '.jpg';
            img.mv(path.resolve(__dirname, '..', 'static', fileName));
    
            const device = await Device.create({ name, price, brandId, typeId, img: fileName });
            
            if (info) {
                info = JSON.parse(info);
                info.forEach(i => {
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: device.id
                    })
                });
            }

            return res.json(device) 
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAllDevices(req, res) {
        let  { typeId, brandId, limit, page } = req.query;
        page = page || 1;
        limit = limit || 10;
        let offset = page * limit - limit;

        let devices;
        if (!typeId && !brandId) {
            devices = await Device.findAndCountAll({ where: { deletedAt: null }, limit, offset });
        }
        if (!typeId && brandId) {
            devices = await Device.findAndCountAll({ where: { deletedAt: null, brandId }, limit, offset });
        }
        if (typeId && !brandId) {
            devices = await Device.findAndCountAll({ where: { deletedAt: null, typeId }, limit, offset});
        }
        if (typeId && brandId) {
            devices = await Device.findAndCountAll({ where: { deletedAt: null, brandId, typeId }, limit, offset});
        }

        return res.json(devices);
    }

    async getDeviceById(req, res) {
        const { id } = req.params;
        const device = await Device.findOne(
            {
                where: { id },
                include: [{ model: DeviceInfo, as: 'info' }]
            }
        )

        return res.json(device);
    }

    async deleteDevice(req, res) {
        const { id } = req.params;
        const deletableDevice = await Device.findOne({ where: { id }});

        if (deletableDevice) {
            await Device.destroy({ where: { id }});
        }
        if (deletableDevice?.img) {
            await unlink(`/Users/user/main/OS/server/static/${deletableDevice.img}`);
        }
        const devices = await Device.findAll( { order: [['id', 'ASC']]});

        return res.json(devices);
    };

    async patchDevice(req, res) {
        const { id, name } = req.body;
        const img = !!req.files?.img;

        let device;
        // If we didn't get a valid ID, so we catch it
        try {
            device = await Device.findOne({ where: { id }});
        } catch (e) {
            return res.json({ message: 'Invalid id' });
        }
        // No params
        if (!img && !name) {
            return res.json({ message: 'Invalid params' });
        }

        // Only 'Name' changing
        if (name && !img) {
            if (name !== device.name) {
                Device.update({ name }, { where: { id }});
            }
        }

        // 'Name' and 'Image' changing
        if (name && img) {
            if (device.img) {
                try {
                    await unlink(`/Users/user/main/OS/server/static/${device.img}`);
                } catch (e) {}
            }
            const fileName = uuid.v4() + '.jpg';
            req.files.img.mv(path.resolve(__dirname, '..', 'static', fileName));
            if (name !== device.name) {
                Device.update({ img: fileName, name }, { where: { id }});;
            } else {
                Device.update({ img: fileName }, { where: { id }});
            }
        }

        // Only 'Image' changing
        if (req.files?.img && !name) {
            if (device.img) {
                try {
                    await unlink(`/Users/user/main/OS/server/static/${device.img}`);
                } catch (e) {}
            }
            const fileName = uuid.v4() + '.jpg';
            req.files.img.mv(path.resolve(__dirname, '..', 'static', fileName));
            await Device.update({ img: fileName }, { where: { id }});
        }
        const devices = await Device.findAll( { order: [['id', 'ASC']]});

        return res.json(devices);
    }
}

module.exports = new DeviceController;
