import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import User from "../../../../lib/models/User";
import mongoose, { Types } from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

export const GET = async () => {
    try {
        await connectDB(); // Connect to the database
        const users = await User.find(); // Retrieve users from the database
        return new NextResponse(JSON.stringify({message: "Users fetched successfully", users: users}), { status: 200 }); // Return a successful response with the users data
    } catch (error) {
        return new NextResponse("Error fetching users: " + error, { status: 500 }); // Return an error response with status code 500
    }
}

export const POST = async (req: Request) => {
    const body = await req.json();
    await connectDB();
    try {
        const newUser = new User({
            name: body.name,
            email: body.email,
            password: body.password,
        });
        await newUser.save();
        return new NextResponse(JSON.stringify({message: "User created successfully", user: newUser}), { status: 201 });
    } catch (error) {
        return new NextResponse("Error creating user: " + error, { status: 500 });
    }
}

export const PUT = async (req: Request) => {
    const body = await req.json();
    const {userId, newUsername} = body;
    await connectDB();
    if(!userId || !newUsername) {
        return new NextResponse(JSON.stringify({message: "User ID and new username are required"}),  {status: 400 });
    }
    if(!Types.ObjectId.isValid(userId)) {
        return new NextResponse(JSON.stringify({message: "Invalid user ID"}),  {status: 400 });
    }
    try {
        const updatedUser = await User.findOneAndUpdate(
            {_id: new Types.ObjectId(userId)},
            { name: newUsername }, 
            { new: true });

        if(!updatedUser) {
            return new NextResponse(JSON.stringify({message: "User not found"}),  {status: 400 });
        }
        return new NextResponse(JSON.stringify({message: "User name updated successfully", user: updatedUser}), { status: 200 });
    } catch (error) {
        return new NextResponse("Error updating name: " + error, { status: 500 });
    }
}

export const DELETE = async (req: Request) => {
    try {
        const {searchParams} = new URL(req.url);
        const userId = searchParams.get("userId");

        if(!userId) {
            return new NextResponse(JSON.stringify({message: "User ID is required"}),  {status: 400 });
        }

        if(!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({message: "Invalid user ID"}),  {status: 400 });
        }
        await connectDB();
        const deletedUser = await User.findByIdAndDelete(new Types.ObjectId(userId));
        return new NextResponse(JSON.stringify({message: "User deleted successfully", user: deletedUser}), { status: 200 });
    } catch (error) {
        return new NextResponse("Error deleting user: " + error, { status: 500 });
    }}
