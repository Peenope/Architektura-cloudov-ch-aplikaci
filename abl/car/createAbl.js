const Ajv = require("ajv");
const ajv = new Ajv();
const carDao = require("../../dao/car-dao.js");

const schema = {
  type: "object",
  properties: {
    VIN: { type: "string", minLength: 17, maxLength: 17 },
    SPZ: { type: "string", minLength: 7, maxLength: 7 },
    model: { type: "string" },
    Palivo: { type: "string", enum: ["Benzin", "Nafta", "LPG", "Elektro"] },
    yearOfMake: { type: "number" }
  },
  required: ["VIN", "SPZ", "model", "Palivo", "yearOfMake"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
  try {
    let car = req.body;
    const valid = ajv.validate(schema, car);
    if (!valid) return res.status(400).json({ code: "dtoInIsNotValid", validationError: ajv.errors });

    const carList = carDao.list();
    if (carList.some((c) => c.VIN === car.VIN || c.SPZ === car.SPZ)) {
      return res.status(400).json({ code: "carAlreadyExists", message: "Vůz s tímto VIN nebo SPZ již existuje." });
    }

    car = carDao.create(car);
    res.json(car);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
module.exports = CreateAbl;