const router = require("express").Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../controllers/authenticateToken')

router.get("/", authController.user_api);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authenticateToken, authController.logout);
router.get("/logout-all", authenticateToken, authController.logoutAll);
router.post("/generate-token", authController.generateToken);
router.get("/test", authenticateToken, authController.testContent);
// router.get("/:productId", authController.product_details);
// router.put("/:productId", authController.product_update);
// router.delete("/:productId", authController.product_delete);

module.exports = router;