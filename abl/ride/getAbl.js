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

async function GetAbl(req, res) {
  try {
    // get request query or body
    const reqParams = req.query?.id ? req.query : req.body;

    // validate input
    const valid = ajv.validate(schema, reqParams);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // read ride by given id
    const ride = rideDao.get(reqParams.id);
    if (!ride) {
      res.status(404).json({
        code: "rideNotFound",
        message: `ride ${reqParams.id} not found`,
      });
      return;
    }
    res.json(ride);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = GetAbl;
