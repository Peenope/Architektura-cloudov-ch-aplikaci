const rideDao = require("../../dao/ride-dao.js");

async function ListAbl(req, res) {
  try {
    const rideList = rideDao.list();
    res.json(rideList);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
module.exports = ListAbl;