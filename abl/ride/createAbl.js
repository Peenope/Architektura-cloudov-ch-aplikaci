const Ajv = require("ajv");
const ajv = new Ajv();
const validateDateTime = require("../../helpers/validate-date-time.js");
ajv.addFormat("date-time", { validate: validateDateTime });

const rideDao = require("../../dao/ride-dao.js");
const carDao = require("../../dao/car-dao.js");

const schema = {
  type: "object",
  properties: {
    name: { type: "string" },
    carSPZ: { type: "string" },
    date: { type: "string", format: "date-time" },
    kilometers_start: { type: "number" },
    kilometers_end: { type: "number" },
  },
  required: ["name", "carSPZ", "date", "kilometers_start", "kilometers_end"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
  try {
    let ride = req.body;
    const valid = ajv.validate(schema, ride);
    if (!valid) return res.status(400).json({ code: "dtoInIsNotValid", validationError: ajv.errors });

    const car = carDao.list().find((c) => c.SPZ === ride.carSPZ);
    if (!car) return res.status(400).json({ code: "carNotFound", message: "Auto s touto SPZ neexistuje." });

    if (ride.kilometers_end <= ride.kilometers_start) {
      return res.status(400).json({ code: "invalidKM", message: "Konec jízdy musí mít více km než začátek." });
    }

    ride.id_car = car.id; // Vazba na auto
    ride = rideDao.create(ride);
    res.status(201).json(ride);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
module.exports = CreateAbl;