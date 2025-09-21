import Sales from "../models/Sales.js"; // Capitalize model

// Get sales (optionally filter by date)
export const getdata = async (req, res) => {
  try {
    const { date } = req.params;
    const filter = { user: req.user._id }; // req.user must come from auth middleware

    if (date) filter.date = date; // optional date filter

    const data = await Sales.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ data });
  } catch (err) {
    console.error("Unable to get the data:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add a sale
export const addsale = async (req, res) => {
  try {
    const { date, name, price, method } = req.body;

    const sale = new Sales({
      date,
      name,
      price,
      method,
      user: req.user._id, // track who created it
    });

    await sale.save();
    res.status(201).json({ success: true, sale });
  } catch (err) {
    console.error("Unable to add sale:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Undo most recent sale for this user
export const undorecentSale = async (req, res) => {
  try {
    const deletedSale = await Sales.findOneAndDelete(
      { user: req.user._id },
      { sort: { createdAt: -1 } }
    );

    if (!deletedSale) {
      return res.status(404).json({ message: "No sale found to delete" });
    }

    res.status(200).json({ success: true, deletedSale });
  } catch (err) {
    console.error("Unable to delete sale:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
