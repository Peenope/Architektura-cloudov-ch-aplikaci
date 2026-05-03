const Ajv = require("ajv");
const ajv = new Ajv();
const validateDateTime = require("../../helpers/validate-date-time.js");
ajv.addFormat("date-time", { validate: validateDateTime });

const carDao = require("../../dao/car-dao.js");

const schema = {
  type: "object",
  properties: {
    VIN: { type: "string", minLength: 17, maxLength: 17 },
    SPZ: { type: "string",minLength: 7, maxLength: 7},
    Rok_vyroby: { type: "number" },
    Palivo: { type: "string" }
  },
  required: ["id"],
  additionalProperties: true,
};

async function UpdateAbl(req, res) {
  try {
    let car = req.body;

    const valid = ajv.validate(schema, car);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    const carList = carDao.list();

    const VINExists = carList.some(
      (u) => u.VIN === car.VIN && u.id !== car.id
    );
    if (VINExists) {
      res.status(400).json({
        code: "VINAlreadyExists",
        message: `car with VIN ${car.VIN} already exists`,
      });
      return;
    }
    const SPZExists = carList.some(
      (u) => u.SPZ === car.SPZ && u.id !== car.id
    );
    if (SPZExists) {
      res.status(400).json({
        code: "SPZAlreadyExists",
        message: `car with SPZ ${car.SPZ} already exists`,
      });
      return;
    }

    const updatedcar = carDao.update(car);
    if (!updatedcar) {
      res.status(404).json({
        code: "carNotFound",
        message: `car ${car.id} not found`,
      });
      return;
    }

    res.json(updatedcar);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = UpdateAbl;
