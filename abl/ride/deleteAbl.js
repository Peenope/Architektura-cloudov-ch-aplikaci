const Ajv = require("ajv");
const ajv = new Ajv();

const rideDao = require("../../dao/ride-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
  additionalProperties: false,
};

async function DeleteAbl(req, res) {
  try {
    const reqParams = req.body;

    // Validate input
    const valid = ajv.validate(schema, reqParams);
    if (!valid) {
      return res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
    }

    const ride = rideDao.get(reqParams.id);
    if (!ride) {
      return res.status(404).json({
        code: "rideNotFound",
        message: `Ride with ID ${reqParams.id} not found`,
      });
    }

    rideDao.remove(reqParams.id);
    res.status(200).json({});
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = DeleteAbl;
