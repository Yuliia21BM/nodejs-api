const express = require("express");
const router = express.Router();
const ctrlContacts = require("../../controllers/contacts");
const {
  validateBody,
  validateFavorite,
  authenticate,
} = require("../../middlewares");
const { addSchema } = require("../../schemas");
const { updateSchema } = require("../../schemas");
const { updateFavoriteSchema } = require("../../schemas");
const { isValidId } = require("../../middlewares");

router.get("/", authenticate, ctrlContacts.getAll);

router.get("/:contactId", authenticate, isValidId, ctrlContacts.getById);

router.post(
  "/",
  authenticate,
  validateBody(addSchema),
  ctrlContacts.addContact
);

router.delete(
  "/:contactId",
  authenticate,
  isValidId,
  ctrlContacts.deleteContact
);

router.put(
  "/:contactId",
  authenticate,
  isValidId,
  validateBody(updateSchema),
  ctrlContacts.updateContact
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  validateFavorite(updateFavoriteSchema),
  ctrlContacts.updateStatusContact
);

module.exports = router;
