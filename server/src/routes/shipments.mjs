import { Router } from "express";
import { auth, adminAuth } from "../utils/middlewares.mjs";
import { User } from "../mongoose/schemas/User.mjs";
import { Company } from "../mongoose/schemas/Company.mjs";
import { Shipment } from "../mongoose/schemas/Shipment.mjs";


const router = Router();

// Fetch all shipments
router.get("/api/shipments", adminAuth, async (req, res) => {
    try {

        const shipments = await Shipment.find().populate('createdBy', 'email').populate('company', 'name');
        res.json(shipments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Fetch shipments for the logged-in client
router.get("/api/client/shipments", auth, async (req, res) => {
    try {
        // Ensure only shipments created by the logged-in user are returned
        // and populate both the company name and createdBy email.
        const shipments = await Shipment.find({ createdBy: req.user.id })
            .populate('company', 'name')
            .populate('createdBy', 'email'); // Populate the createdBy field with the email
        res.json(shipments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// Create a new shipment
router.post("/api/shipments", auth, async (req, res) => {
    try {
        const { company, destination, weight } = req.body;
        const createdBy = req.user.id; // Use req.user.id to get the user's ID
        const price = 1 + (weight > 1 ? weight - 1 : 0);
        // Ensure that weight is provided and is a positive number
        if (!weight || weight <= 0) {
            return res.status(400).json({ message: "Invalid weight provided. Weight must be a positive number." });
        }

        // Create new shipment
        const newShipment = new Shipment({
            createdBy,
            company,
            destination,
            weight,
            price, // Include the weight from the request body
            // Status is set to 'preparing' by default in your schema
            // Price will be calculated automatically in the pre-save hook
        });
        await newShipment.save();

        // Update company to include new shipment
        await Company.findByIdAndUpdate(
            company,
            { $push: { shipments: newShipment._id } },
            { new: true, useFindAndModify: false }
        );

        // Since the createdBy is a direct relation to the Shipment through its creation,
        // and assuming your User schema tracks shipments, you might update it as well.
        // Note: This step might be redundant or necessary depending on your schema design.
        await User.findByIdAndUpdate(
            createdBy,
            { $push: { shipments: newShipment._id } },
            { new: true, useFindAndModify: false }
        );

        res.status(201).json(newShipment);
    } catch (error) {
        console.error("Error creating shipment:", error);
        res.status(400).json({ message: error.message });
    }
});


// Delete shipment
router.delete("/api/shipments/:shipmentId", adminAuth, async (req, res) => {
    try {
        const { shipmentId } = req.params;

        // Find the shipment to get its company and createdBy before deletion
        const shipment = await Shipment.findById(shipmentId);
        if (!shipment) {
            return res.status(404).json({ message: "Shipment not found" });
        }

        // Delete the shipment
        await Shipment.findByIdAndDelete(shipmentId);

        // Remove shipment from company
        await Company.findByIdAndUpdate(
            shipment.company,
            { $pull: { shipments: shipmentId } },
            { new: true, useFindAndModify: false }
        );

        // Remove shipment from user
        await User.findByIdAndUpdate(
            shipment.createdBy,
            { $pull: { shipments: shipmentId } },
            { new: true, useFindAndModify: false }
        );

        res.status(200).json({ message: "Shipment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update shipment
router.patch("/api/shipments/:shipmentId/status", adminAuth, async (req, res) => {
    try {
        const { shipmentId } = req.params;
        const { status } = req.body;

        // Validate the status
        const validStatuses = ['preparing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status provided" });
        }

        // Find the shipment and update its status
        const updatedShipment = await Shipment.findByIdAndUpdate(
            shipmentId,
            { status: status },
            { new: true, useFindAndModify: false }
        );

        if (!updatedShipment) {
            return res.status(404).json({ message: "Shipment not found" });
        }

        res.status(200).json(updatedShipment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;