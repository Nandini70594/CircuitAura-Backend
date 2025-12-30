const {
  createOrder,
  getOrdersByUserId,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
} = require('../models/orderModel');

const createNewOrder = async (req, res) => {
  try {
    console.log('=== ORDER CREATE ===');
    const { items, customer_name, customer_email, customer_phone, customer_pincode, customer_city, customer_address } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No items provided' });
    }

    const userId = req.user.id;
    const finalCustomerName = customer_name?.trim() || req.user.name?.trim() || 'Customer';
    const finalCustomerEmail = customer_email?.trim() || req.user.email || null;
    const finalCustomerPhone = customer_phone?.trim() || null;
    const finalCustomerPincode = customer_pincode?.trim() || null;
    const finalCustomerCity = customer_city?.trim() || null;
    const finalCustomerAddress = customer_address?.trim() || null;

    if (!finalCustomerName) {
      return res.status(400).json({ message: 'Customer name required' });
    }

    let totalAmount = 0;
    items.forEach((item) => {
      totalAmount += Number(item.unit_price) * Number(item.quantity);
    });

    const orderData = {
      user_id: userId,
      customer_name: finalCustomerName,
      customer_email: finalCustomerEmail,
      customer_phone: finalCustomerPhone,
      customer_pincode: finalCustomerPincode,
      customer_city: finalCustomerCity,
      customer_address: finalCustomerAddress,
      total_amount: totalAmount,
      currency: 'INR',
      status: 'pending',
    };

    const order = await createOrder(orderData);

    // Create order items
    const supabase = require('../config/supabase');
    const itemRows = items.map((item) => ({
      order_id: order.id,
      product_type: item.type || 'product',
      product_id: parseInt(item.product_id),
      product_name: item.product_name?.trim() || 'Unknown',
      unit_price: parseFloat(item.unit_price),
      quantity: parseInt(item.quantity),
      line_total: parseFloat(item.unit_price) * parseInt(item.quantity),
    }));

    await supabase.from('order_items').insert(itemRows);

    res.status(201).json({ id: order.id, ...orderData, items });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ message: err.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await getOrdersByUserId(userId);
    res.json(orders);
  } catch (err) {
    console.error('getMyOrders error:', err);
    res.status(500).json({ message: 'DB error' });
  }
};

const getAllOrdersWithItems = async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (err) {
    console.error('getAllOrders error:', err);
    res.status(500).json({ message: 'DB error' });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['pending', 'paid', 'shipped', 'delivered'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedOrder = await updateOrderStatus(id, status);
    res.json({ message: 'Status updated', status });
  } catch (err) {
    console.error('updateOrderStatus error:', err);
    res.status(500).json({ message: 'DB error' });
  }
};

const cancelMyOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await cancelOrder(id, userId);
    res.json({ message: 'Order cancelled' });
  } catch (err) {
    console.error('cancelMyOrder error:', err);
    res.status(400).json({ message: 'Order cannot be cancelled' });
  }
};

const deleteMyOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await deleteOrder(id, userId);
    res.json({ message: 'Order removed' });
  } catch (err) {
    console.error('deleteOrder error:', err);
    res.status(400).json({ message: 'Order cannot be removed (must be cancelled)' });
  }
};

module.exports = {
  createNewOrder,
  getMyOrders,
  getAllOrdersWithItems,
  updateStatus,
  cancelMyOrder,
  deleteMyOrder,
};
