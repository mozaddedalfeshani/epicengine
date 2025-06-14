import { NextResponse } from "next/server";
import mongoose from "mongoose";

// Define the User schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  isAdmin: { type: Boolean, default: false },
});

// Create the User model
const User = mongoose.models.User || mongoose.model("User", userSchema);

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export async function POST(request: Request) {
  try {
    await connectDB();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ email, isAdmin: false });
    }

    return NextResponse.json({ isAdmin: user.isAdmin });
  } catch (error) {
    console.error("Error checking admin status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
