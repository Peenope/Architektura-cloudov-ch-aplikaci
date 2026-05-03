const Ajv = require("ajv");
const ajv = new Ajv();
const carDao = require("../../dao/car-dao.js");
const rideDao = require("../../dao/ride-dao.js");
const fs = require("fs");
const path = require("path");

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

    // read car by given id
    const car = carDao.get(reqParams.id);
    if (!car) {
      res.status(404).json({
        code: "carNotFound",
        message: `car ${reqParams.id} not found`,
      });
      return;
    }

    res.json(car);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = GetAbl;
