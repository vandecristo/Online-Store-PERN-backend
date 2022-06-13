const { Device, DeviceInfo } = require('../models/models');
const ApiError = require('../error/ApiError');
const uuid = require('uuid');
const path = require('path');

class DeviceController {

    async createDevice(req, res, next) {
        try {
            let { name, price, brandId, typeId, info } = req.body;
            const { img } = req.files;
            let fileName = uuid.v4() + '.jpg';
            img.mv(path.resolve(__dirname, '..', 'static', fileName));
    
            const device = await Device.create({name, price, brandId, typeId, img: fileName});
            
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
        const { id } = req.query;
       const device = await Device.findAll({
            where: { id }
        })

        const delitionDate = + Date.now();
         console.log("dfgdfgdfgfdgdfg", delitionDate);

        if (device[0]) {
            const deletableDevice = Device.update(
                { deletedAt: delitionDate },
                { where: { id }}
            )
            return res.json({ message: 'Device has been succesfully deleted.' })
        } else {
            return res.json({ message: "Device with this Id not found or already been deleted." })
        }      
    }

}

module.exports = new DeviceController