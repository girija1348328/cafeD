const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ✅ Create an order
exports.createOrder = async (req, res) => {
    try {
        const { userId, items, orderType, address } = req.body;

        if (!userId || !items || items.length === 0) {
            return res.status(400).json({ message: "User ID and items are required." });
        }

        // Calculate total price
        let totalPrice = 0;
        for (const item of items) {
            const menuItem = await prisma.menuItem.findUnique({
                where: { id: item.menuItemId }
            });

            if (!menuItem) {
                return res.status(404).json({ message: `Menu item with ID ${item.menuItemId} not found.` });
            }

            totalPrice += menuItem.price * item.quantity;
        }

        // Create order with items
        const order = await prisma.order.create({
            data: {
                userId,
                totalPrice,
                orderType,
                status: "PENDING",
                items: {
                    create: items.map(item => ({
                        menuItemId: item.menuItemId,
                        quantity: item.quantity,
                        price: item.quantity * totalPrice
                    }))
                },
                delivery: orderType === "DELIVERY" ? {
                    create: {
                        address,
                        deliveryStatus: "pending"
                    }
                } : undefined
            },
            include: { items: true, delivery: true }
        });

        res.status(201).json({ message: "Order placed successfully", order });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: error.message });
    }
};

// ✅ Get all orders for a user
exports.getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await prisma.order.findMany({
            where: { userId },
            include: { items: true, delivery: true }
        });

        res.status(200).json({ orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: error.message });
    }
};

// ✅ Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const validStatuses = ["PENDING", "PROCESSING", "COMPLETED", "CANCELLED"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid order status" });
        }

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status }
        });

        res.status(200).json({ message: "Order status updated", order: updatedOrder });
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ error: error.message });
    }
};
