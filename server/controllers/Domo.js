const models = require('../models');
const DomoModel = require('../models/Domo');

const { Domo } = models;

const makerPage = (req, res) => res.render('app');

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'Both name and age are required!' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    power: req.body.power,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.status(201).json({ name: newDomo.name, age: newDomo.age, power: newDomo.power });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }
    return res.status(400).json({ error: 'An error occured!' });
  }
};

const deleteDomo = async (req, res) => {
  try {
    await Domo.deleteOne({
      name: req.body.name,
      owner: req.session.account._id,
    });
    return res.status(204).json({ message: 'Domo deleted!' });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occured!' });
  }
};

const getDomos = (req, res) => DomoModel.findByOwner(req.session.account._id, (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred!' });
  }

  return res.json({ domos: docs });
});

module.exports = {
  makerPage,
  makeDomo,
  deleteDomo,
  getDomos,
};
