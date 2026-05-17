const Ajv = require("ajv");
const ajv = new Ajv();
const validateDateTime = require("../../helpers/validate-date-time.js");
ajv.addFormat("date-time", { validate: validateDateTime });

const rideDao = require("../../dao/ride-dao.js");
const carDao = require("../../dao/car-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    carSPZ: { type: "string" },
    date: { type: "string", format: "date-time" },
    kilometers_start: { type: "number" },
    kilometers_end: { type: "number" },
    id_driver: { type: "string" },
  },
  required: ["id", "name", "carSPZ", "date", "kilometers_start", "kilometers_end", "id_driver"],
  additionalProperties: false,
};

async function UpdateAbl(req, res) {
  try {
    let ride = req.body;
    const valid = ajv.validate(schema, ride);
    if (!valid) {
      return res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
    }

    const car = carDao.list().find((c) => c.SPZ === ride.carSPZ);
    if (!car) return res.status(400).json({ code: "carNotFound", message: "Auto s touto SPZ neexistuje." });

    if (ride.kilometers_end <= ride.kilometers_start) {
      return res.status(400).json({ code: "invalidKM", message: "Konec jízdy musí mít více km než začátek." });
    }

    const existingRides = rideDao.list().filter((r) => r.carSPZ === ride.carSPZ && r.id !== ride.id);

    const ridesBefore = existingRides.filter((r) => new Date(r.date) <= new Date(ride.date));
    if (ridesBefore.length > 0) {
      const maxPastKm = Math.max(...ridesBefore.map((r) => r.kilometers_end));
      if (ride.kilometers_start < maxPastKm) {
        return res.status(400).json({
          code: "invalidKMSequence",
          message: `Kilometry nenavazují. Začátek této jízdy (${ride.kilometers_start} km) nemůže být nižší než konec předchozí jízdy (${maxPastKm} km).`,
        });
      }
    }

    const ridesAfter = existingRides.filter((r) => new Date(r.date) > new Date(ride.date));
    if (ridesAfter.length > 0) {
      const minFutureKm = Math.min(...ridesAfter.map((r) => r.kilometers_start));
      if (ride.kilometers_end > minFutureKm) {
        return res.status(400).json({
          code: "invalidKMSequenceAfter",
          message: `Kilometry nenavazují. Konec této jízdy (${ride.kilometers_end} km) nemůže být vyšší než začátek budoucí jízdy (${minFutureKm} km).`,
        });
      }
    }

    ride.id_car = car.id;
    const updatedride = rideDao.update(ride);
    if (!updatedride) return res.status(404).json({ code: "rideNotFound", message: `ride ${ride.id} not found` });

    res.json(updatedride);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
module.exports = UpdateAbl;