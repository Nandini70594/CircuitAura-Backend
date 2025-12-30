const supabase = require('../config/supabase');

const createOrder = async (orderData) => {
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();
  if (error) throw error;
  return data;
};

const getOrdersByUserId = async (userId) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        product_id,
        product_name,
        product_type,
        unit_price,
        quantity,
        line_total
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

const getAllOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        product_id,
        product_name,
        product_type,
        unit_price,
        quantity,
        line_total
      )
    `)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

const updateOrderStatus = async (id, status) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

const cancelOrder = async (id, userId) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status: 'cancelled' })
    .eq('id', id)
    .eq('user_id', userId)
    .eq('status', 'pending')
    .select()
    .single();
  if (error) throw error;
  return data;
};

const deleteOrder = async (id, userId) => {
  // Delete order items first
  await supabase
    .from('order_items')
    .delete()
    .eq('order_id', id);

  // Delete order
  const { data, error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
    .eq('status', 'cancelled');
  if (error) throw error;
  return data;
};

module.exports = {
  createOrder,
  getOrdersByUserId,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
};
