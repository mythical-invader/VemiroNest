const Order = require('../models/Order');
const sendEmail = require('../utils/sendEmail');

const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, address, paymentId, guestEmail, paymentMethod } = req.body;
        
        if (!items || items.length === 0 || !totalAmount || !address) {
            return res.status(400).json({ message: 'Invalid order data' });
        } else {
            const products = items.map(item => ({
                product: item.productId || item._id,
                qty: item.qty,
                price: item.price
            }));
            
            const order = new Order({
                user: req.user ? req.user._id : undefined,
                guestEmail: req.user ? undefined : guestEmail,
                paymentMethod: paymentMethod || 'safepay',
                products,
                totalAmount,
                address,
                paymentID: paymentId
            });
            
            await order.save();
            res.status(201).json({ message: 'Order created successfully', order });
        }
    } catch(error) {
        res.status(500).json({ message: 'Error creating order', details: error.message });
    }
};

const myOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('products.product', 'name price');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 }).populate('user', 'id name').populate('products.product', 'name price');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        
        if (order) {
            const formattedStatus = status.toLowerCase();
            order.status = formattedStatus;
            await order.save();
            
            if (order.user && order.user.email && (formattedStatus === 'shipped' || formattedStatus === 'delivered')) {
                const actionText = formattedStatus === 'shipped' ? 'shipped and is on its way' : 'delivered successfully';
                const subject = formattedStatus === 'shipped' ? 'Your VemiroNest order has been shipped!' : 'Your VemiroNest order has been delivered!';
                const message = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">  <div style="background-color: ${formattedStatus === 'shipped' ? '#3b82f6' : '#10b981'}; padding: 20px; text-align: center; color: #ffffff;">    <h1 style="margin: 0;">Order Update</h1>  </div>  <div style="padding: 30px; line-height: 1.6; color: #333;">    <h2>Hi ${order.user.name},</h2>    <p>Good news! Your order <strong>${order._id}</strong> has been <strong>${actionText}</strong>.</p>    <p>Here are your order details:</p>    <ul>      <li>Order Total: Rs. ${order.totalAmount.toFixed(2)}</li>      <li>Status: <span style="text-transform: capitalize; font-weight: bold; color: ${formattedStatus === 'shipped' ? '#3b82f6' : '#10b981'};">${formattedStatus}</span></li>    </ul>    <p>Thank you for shopping with <strong>VemiroNest</strong>.</p>    <p>Best regards,<br>The VemiroNest Team</p>  </div></div>`;
                
                sendEmail(order.user.email, subject, message).catch(err => console.error(err));
            }
            
            res.json({ message: 'Order status updated', order });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error){
        res.status(500).json({message: 'Error updating order status', error: error.message});
    }
};

module.exports = { createOrder, getOrders, myOrders, updateOrderStatus };