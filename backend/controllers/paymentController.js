require('dotenv').config(); 
const { Safepay } = require('@sfpy/node-sdk');
const sendEmail = require('../utils/sendEmail');

const getSafepayInstance = () => {
    return new Safepay({
        environment: process.env.SAFEPAY_ENVIRONMENT || 'sandbox',
        apiKey: process.env.SAFEPAY_API_KEY,
        v1Secret: process.env.SAFEPAY_API_SECRET || process.env.SAFEPAY_SECRET_KEY,
        webhookSecret: process.env.SAFEPAY_WEBHOOK_SECRET || 'dummy_webhook_secret'
    });
};

const createPaymentSession = async (req, res) => {
    try {
        const safepay = getSafepayInstance(); 
        const { totalAmount, orderId } = req.body;
        const payment = await safepay.payments.create({
            amount: totalAmount * 100, 
            currency: 'PKR'
        });
        const checkoutUrl = safepay.checkout.create({
            token: payment.token,
            orderId: orderId || 'order_' + Date.now(),
            cancelUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout`,
            redirectUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/`,
            source: 'custom',
            webhooks: true
        });
        res.json({ 
            success: true, 
            token: payment.token,
            url: checkoutUrl
        });
    } catch (error) {
        console.error("Safepay SDK Error:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Error creating payment session", 
            error: error.message 
        });
    }
};

const processSuccessfulOrder = async (orderId, trackerId, isFromFrontend = false) => {    const Order = require('../models/Order');    const Product = require('../models/Product');    const order = await Order.findById(orderId).populate('user', 'name email').populate('products.product', 'name price');        if (!order) {        console.log(`Order ${orderId} not found in processSuccessfulOrder`);        return null;    }        let newlyCompleted = false;    if (!order.paymentID) {        order.paymentID = trackerId || `COD_${Date.now()}`;        await order.save();                for (const item of order.products) {            const product = await Product.findById(item.product);            if (product) {                const currentStock = parseInt(product.stock) || 0;                product.stock = Math.max(0, currentStock - item.qty);                await product.save();            }        }        newlyCompleted = true;        console.log(`Stock reduced and order ${orderId} completed successfully (tracker: ${trackerId || 'COD'})`);    }        const recipientEmail = (order.user && order.user.email) ? order.user.email : order.guestEmail;    const recipientName = (order.user && order.user.name) ? order.user.name : 'Guest';        if (recipientEmail && isFromFrontend) {        const message = `        <!DOCTYPE html><html><head>        <style>            .container { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px; }            .header { background-color: #f97316; color: white; padding: 10px; text-align: center; border-radius: 5px 5px 0 0; }            .content { padding: 20px; }            .footer { text-align: center; font-size: 12px; color: #777; margin-top: 20px; }        </style></head><body>        <div class="container">            <div class="header">                <h1>Order Confirmed!</h1>            </div>            <div class="content">                <h2>Hello ${recipientName}!</h2>                <p>Thank you for shopping with <strong>VemiroNest</strong>. We are excited to let you know that we have successfully received your order (Order ID: ${order._id}) and it is now being processed.</p>                <p>You will receive another email once your order has been shipped. If you have any questions, feel free to reach out to our support team.</p>                <p>Happy Shopping!</p>            </div>            <div class="footer">                <p>&copy; 2026 VemiroNest. All rights reserved.</p>            </div>        </div></body></html>        `;        sendEmail(recipientEmail, 'Order Confirmed - VemiroNest', message).catch(err => console.error(err));    }        return order; };

const paymentWebhook = async (req, res) => {
    try {
        const safepay = getSafepayInstance();
        const isValid = safepay.verify.webhook(req);
        if (!isValid) {
            return res.status(400).json({ success: false, message: "Invalid webhook signature" });
        }
        const { tracker, reference } = req.body;
        await processSuccessfulOrder(reference, tracker, false);
        res.status(200).json({ success: true, message: "Webhook processed" });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const confirmPayment = async (req, res) => {
    try {
        const safepay = getSafepayInstance();
        const { tracker, reference, sig } = req.body;
        const Order = require('../models/Order');
        const order = await Order.findById(reference).populate('user', 'name email').populate('products.product', 'name price');
        
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        
        if (sig && sig !== 'COD') {
            const isValid = safepay.verify.signature({ body: { sig, tracker } });
            if (!isValid) {
                return res.status(400).json({ success: false, message: "Invalid signature" });
            }
        }
        await processSuccessfulOrder(reference, tracker, true);
        const updatedOrder = await Order.findById(reference).populate('user', 'name email').populate('products.product', 'name price');
        res.json({ success: true, message: "Payment confirmed", order: updatedOrder });
    } catch (error) {
        console.error("Confirm payment error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createPaymentSession, paymentWebhook, confirmPayment };