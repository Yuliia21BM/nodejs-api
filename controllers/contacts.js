const Contact = require("../models/contact");
const { HTTPError } = require("../helpers");
const { ctrlWrapper } = require("../helpers");

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { limit, page, favorite: fav } = req.query;
  const skip = limit * (page - 1);
  const favorite = fav ? { favorite: fav } : null;
  console.log(favorite);
  const allContacts = await Contact.find(
    { owner, ...favorite },
    "-createdAt -updatedAt",
    {
      skip,
      limit,
    }
  ).populate("owner", "name email");
  res.status(200).json(allContacts);
};

const getById = async (req, res) => {
  const { _id: owner } = req.user;
  const { contactId } = req.params;
  const contact = await Contact.findOne({ _id: contactId, owner });
  if (!contact) {
    throw HTTPError(404, "Not Found");
  }
  res.status(200).json(contact);
};

const addContact = async (req, res) => {
  const { _id: owner } = req.user;
  const body = req.body;
  const contact = await Contact.create({ ...body, owner });
  res.status(201).json(contact);
};

const deleteContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { contactId } = req.params;
  const contact = await Contact.findOneAndDelete({ _id: contactId, owner });
  if (!contact) {
    throw HTTPError(404, "Not Found");
  }
  res.status(200).json({ message: "contact deleted" });
};

const updateContact = async (req, res) => {
  const { _id: owner } = req.user;
  const body = req.body;
  const { contactId } = req.params;
  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, owner },
    body,
    {
      new: true,
    }
  );
  if (!contact) {
    throw HTTPError(404, "Not Found");
  }
  res.status(201).json(contact);
};

const updateStatusContact = async (req, res) => {
  const { _id: owner } = req.user;
  const body = req.body;
  const { contactId } = req.params;
  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, owner },
    body,
    {
      new: true,
    }
  );
  if (!contact) {
    throw HTTPError(404, "Not Found");
  }
  res.status(201).json(contact);
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  addContact: ctrlWrapper(addContact),
  deleteContact: ctrlWrapper(deleteContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
