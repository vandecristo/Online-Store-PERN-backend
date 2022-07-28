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

    async getAllDevices(req, res){
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

    async getDeviceById(req, res){ 
        const { id } = req.params;
        const device = await Device.findOne(
            {
                where: { id },
                include: [{ model: DeviceInfo, as: 'info' }]
            }
        )

        return res.json(device);
    }

    async deleteDevice(req, res){
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
}

module.exports = new DeviceController;
