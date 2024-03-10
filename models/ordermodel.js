import mongoose from "mongoose";


const orderSchema = new mongoose.Schema(
    {
      products: [
        {
          type: mongoose.ObjectId,
          ref: "product",
        },
      ],
      payment: {},
      buyer: {
        type: String,
        ref: "users",
      },
      status: {
        type: String,
        default: "Not Process",
        enum: ["Not Process", "Processing", "Shipped", "deliverd", "cancel"],
      },
    },
    { timestamps: true }
  );
  
  export default mongoose.model("Order", orderSchema);