const Ajv = require("ajv");
const ajv = new Ajv();
const validateDateTime = require("../../helpers/validate-date-time.js");
ajv.addFormat("date-time", { validate: validateDateTime });

const rideDao = require("../../dao/ride-dao.js");

const schema = {
  type: "object",
  properties: {
    id_driver: { type: "string" },
    id_car: { type: "string" },
    date: { type: "string", format: "date-time" },
    kilometres_start: { type: "number" },
    kilometers_end: { type: "number" },
  },
  required: ["id"],
  additionalProperties: false,
};

async function UpdateAbl(req, res) {
  try {
    let ride = req.body;

    // validate input
    const valid = ajv.validate(schema, ride);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    const updatedride = rideDao.update(ride);
    if (!updatedride) {
      res.status(404).json({
        code: "rideNotFound",
        message: `ride ${ride.id} not found`,
      });
      return;
    }

    res.json(updatedride);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = UpdateAbl;
