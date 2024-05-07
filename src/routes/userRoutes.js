const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController');
const multer = require("multer")
const { validateRequest, checkValidationResult } = require('../middleware/validationMiddleware');

const storage = multer.memoryStorage();

const uploads = multer({
    storage : storage
}).single("image")

// User CRUD
// GET all users
router.get("/crud", userController.getAllUsers);

// GET user by ID
router.get("/crud/:id", userController.getUserById);

// Create a new user
router.post("/crud",uploads,validateRequest("createuser"), checkValidationResult, userController.createUser);

// Update user by ID
router.put("/crud/:id",uploads,validateRequest("createuser"), checkValidationResult, userController.updateUserById);

// Delete user by ID
router.delete("/crud/:id", userController.deleteUserById);


// UserAddress CRUD
// Get ALL userAddress 
router.get("/address", userController.getuserAddress);

// GET userAddress by ID
router.get("/address/:id", userController.getUserAddressById);

// Create a new userAddress
router.post("/address", userController.createUserAddress);
// Update userAddress by ID
router.put("/address/:id", userController.updateUserAddressById);

// Delete userAddress by ID
router.delete("/address/:id", userController.deleteUserAddressById);


module.exports = router;
