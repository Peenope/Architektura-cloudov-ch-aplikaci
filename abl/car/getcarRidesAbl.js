const rideDao = require("../../dao/ride-dao.js");

async function getcarRidesAbl(req, res) {
    try {
        const id = req.query.id || req.body.id;
        if (!id) return res.status(400).json({ error: "Chybí ID vozu." });

        const allRides = rideDao.list();
        const carRides = allRides.filter(ride => ride.id_car === id);
        res.status(200).json(carRides);
    } catch (error) {
        res.status(500).json({ error: "Chyba při načítání historie jízd." });
    }
}
module.exports = getcarRidesAbl;