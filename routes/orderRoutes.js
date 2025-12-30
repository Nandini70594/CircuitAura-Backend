const express = require("express");
const {
  createNewOrder,
  getMyOrders,
  getAllOrdersWithItems,
  updateStatus,
  cancelMyOrder,
  deleteMyOrder,
} = require("../controllers/orderController");
const { authenticateToken, authorizeRole } = require("../middleware/authMiddleware");

const router = express.Router();

// user routes
router.post("/", authenticateToken, createNewOrder);
router.get("/my-orders", authenticateToken, getMyOrders);
router.post("/:id/cancel", authenticateToken, cancelMyOrder);
router.delete("/:id", authenticateToken, deleteMyOrder);

// admin routes
router.get("/", authenticateToken, authorizeRole("admin"), getAllOrdersWithItems);
router.patch("/:id/status", authenticateToken, authorizeRole("admin"), updateStatus);

module.exports = router;
