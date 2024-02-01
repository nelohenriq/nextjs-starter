import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import User from "../../../../lib/models/User";

export const GET = async () => {
    try {
       await connectDB();
       const users = await User.find();
       return new NextResponse(JSON.stringify(users), { status: 200 });
    } catch (error) {
        return new NextResponse("Error fetching users" + error, { status: 500 });
    }
}
