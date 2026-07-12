require("dotenv").config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");
const connectDB = require("./config/db");

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log("✓ Connected to MongoDB");

    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log("✓ Cleared existing data");

    const users = [
      {
        name: "Admin User",
        email: "admin@example.com",
        password: await bcrypt.hash("password123", 10),
        role: "admin",
        verified: true,
      },
      {
        name: "John Doe",
        email: "john@example.com",
        password: await bcrypt.hash("password123", 10),
        role: "user",
        verified: true,
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: await bcrypt.hash("password123", 10),
        role: "user",
        verified: true,
      },
      {
        name: "Mike Johnson",
        email: "mike@example.com",
        password: await bcrypt.hash("password123", 10),
        role: "user",
        verified: false,
      },
      {
        name: "Sarah Wilson",
        email: "sarah@example.com",
        password: await bcrypt.hash("password123", 10),
        role: "user",
        verified: true,
      },
    ];

    const createdUsers = await User.insertMany(users);
    console.log(`✓ Created ${createdUsers.length} users`);

    const products = [

      {
        name: "Minimalist Ceramic Vase",
        description: "Handcrafted matte ceramic vase, perfect for modern Nordic-style home decor.",
        price: 34.99,
        category: "Home & Living",
        stock: "45",
        imageUrl: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=400&q=60",
        ratings: 4.7,
        numOfReviews: 84,
      },
      {
        name: "Scented Soy Wax Candle",
        description: "Premium lavender and sandalwood soy candle with a clean, 40-hour burn time.",
        price: 18.50,
        category: "Home & Living",
        stock: "120",
        imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=400&q=60",
        ratings: 4.8,
        numOfReviews: 195,
      },


      {
        name: "Classic Heavyweight Hoodie",
        description: "Ultra-soft cotton blend oversized hoodie, unisex fit with brushed fleece interior.",
        price: 45.00,
        category: "Apparel",
        stock: "80",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnhYXTkNgDC4SLxNxj8POMvZ6mymJ9AQT-JGaxqXKk8g&s=10",
        ratings: 4.5,
        numOfReviews: 112,
      },
      {
        name: "Minimalist Leather Wallet",
        description: "Slim RFID-blocking genuine leather cardholder wallet with quick-access slots.",
        price: 29.99,
        category: "Apparel",
        stock: "150",
        imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=400&q=60",
        ratings: 4.6,
        numOfReviews: 340,
      },


      {
        name: "Matte Black French Press",
        description: "Double-walled stainless steel coffee maker that keeps your brew hot for hours.",
        price: 39.99,
        category: "Kitchen",
        stock: "60",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQEpd2YyOi36p-M4Yac1pYXtoXSNUbmbAQ8aXXrc9C6A&s=10",
        ratings: 4.7,
        numOfReviews: 156,
      },
      {
        name: "Eco Bamboo Cutting Board",
        description: "Heavy-duty, organic bamboo kitchen chopping board with built-in juice grooves.",
        price: 24.99,
        category: "Kitchen",
        stock: "95",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-muzzMtDXJklR47LvHyvFyNgw5VoxC4mWSJUDHvmcSA&s=10",
        ratings: 4.4,
        numOfReviews: 72,
      },


      {
        name: "Insulated Stainless Steel Flask",
        description: "1-liter vacuum insulated water bottle, keeps drinks ice cold up to 24 hours.",
        price: 22.99,
        category: "Fitness",
        stock: "200",
        imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=400&q=60",
        ratings: 4.9,
        numOfReviews: 512,
      },
      {
        name: "High-Density Yoga Mat",
        description: "6mm non-slip eco-friendly TPE fitness mat with alignment lines for workouts.",
        price: 32.50,
        category: "Fitness",
        stock: "70",
        imageUrl: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=400&q=60",
        ratings: 4.5,
        numOfReviews: 89,
      },


      {
        name: "Ergonomic Aluminum Laptop Stand",
        description: "Adjustable sleek aluminum stand designed to improve posture and airflow.",
        price: 49.99,
        category: "Office",
        stock: "75",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7jWICDnsCCx77hksxkdA6Mppiizz26h12fGI4qoWCuw&s=10",
        ratings: 4.6,
        numOfReviews: 143,
      },
      {
        name: "Minimalist Felt Desk Pad",
        description: "Large anti-slip wool felt desk mat to protect your workspace and ease mouse tracking.",
        price: 19.99,
        category: "Office",
        stock: "110",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3fjXeUPnG7ZOP3bXivKwcAXFlp5rE6hdS1lSAi94WtA&s=10",
        ratings: 4.3,
        numOfReviews: 65,
      },
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`✓ Created ${createdProducts.length} products`);

    const orders = [
      {
        user: createdUsers[1]._id,
        products: [
          {
            product: createdProducts[0]._id,
            qty: 1,
            price: createdProducts[0].price,
          },
          {
            product: createdProducts[1]._id,
            qty: 2,
            price: createdProducts[1].price,
          },
        ],
        totalAmount: createdProducts[0].price + createdProducts[1].price * 2,
        address: {
          fullName: "John Doe",
          street: "123 Main Street",
          city: "New York",
          postalCode: "10001",
          country: "USA",
        },
        paymentID: "pay_" + Math.random().toString(36).substr(2, 9),
        status: "delivered",
      },
      {
        user: createdUsers[2]._id,
        products: [
          {
            product: createdProducts[2]._id,
            qty: 1,
            price: createdProducts[2].price,
          },
          {
            product: createdProducts[4]._id,
            qty: 1,
            price: createdProducts[4].price,
          },
        ],
        totalAmount: createdProducts[2].price + createdProducts[4].price,
        address: {
          fullName: "Jane Smith",
          street: "456 Oak Avenue",
          city: "Los Angeles",
          postalCode: "90001",
          country: "USA",
        },
        paymentID: "pay_" + Math.random().toString(36).substr(2, 9),
        status: "shipped",
      },
      {
        user: createdUsers[3]._id,
        products: [
          {
            product: createdProducts[6]._id,
            qty: 1,
            price: createdProducts[6].price,
          },
        ],
        totalAmount: createdProducts[6].price,
        address: {
          fullName: "Mike Johnson",
          street: "789 Pine Road",
          city: "Chicago",
          postalCode: "60601",
          country: "USA",
        },
        paymentID: "pay_" + Math.random().toString(36).substr(2, 9),
        status: "pending",
      },
      {
        user: createdUsers[4]._id,
        products: [
          {
            product: createdProducts[3]._id,
            qty: 1,
            price: createdProducts[3].price,
          },
          {
            product: createdProducts[9]._id,
            qty: 1,
            price: createdProducts[9].price,
          },
        ],
        totalAmount: createdProducts[3].price + createdProducts[9].price,
        address: {
          fullName: "Sarah Wilson",
          street: "321 Elm Street",
          city: "Houston",
          postalCode: "77001",
          country: "USA",
        },
        paymentID: "pay_" + Math.random().toString(36).substr(2, 9),
        status: "delivered",
      },
    ];

    const createdOrders = await Order.insertMany(orders);
    console.log(`✓ Created ${createdOrders.length} orders`);

    console.log("\n✅ Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - Users: ${createdUsers.length}`);
    console.log(`   - Products: ${createdProducts.length}`);
    console.log(`   - Orders: ${createdOrders.length}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
    process.exit(1);
  }
};

seedDatabase();