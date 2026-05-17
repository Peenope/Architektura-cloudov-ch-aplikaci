const carDao = require("../../dao/car-dao.js");

async function ListAbl(req, res) {
  try {
    const carList = carDao.list();
    res.json(carList);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = ListAbl;
