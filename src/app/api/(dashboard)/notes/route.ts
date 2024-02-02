import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import User from "../../../../lib/models/User";
import mongoose, { Types } from "mongoose";
import Note from "../../../../lib/models/Notes";

export const GET = async (req: Request) => {
    try {
        const {searchParams} = new URL(req.url);
        const userId = searchParams.get("userId");

        if(!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({message: "Invalid or missing userId"}),  {status: 400 });
        }
        await connectDB(); // Connect to the database

        const user = await User.findById(new Types.ObjectId(userId)); // Retrieve user from the database

        if(!user) {
            return new NextResponse(JSON.stringify({message: "User not found"}),  {status: 404 });
        }
        const notes = await Note.find({user: new Types.ObjectId(userId)}); // Retrieve notes for the user from the database
        return new NextResponse(JSON.stringify({message: "Notes fetched successfully", notes: notes}), { status: 200 }); // Return a successful response with the users data
    } catch (error) {
        return new NextResponse("Error fetching users: " + error, { status: 500 }); // Return an error response with status code 500
    }
}

export const POST = async (req: Request) => {
    try {
        const {searchParams} = new URL(req.url);
        const userId = searchParams.get("userId");

        if(!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({message: "Invalid or missing userId"}),  {status: 400 });
        }
        const body = await req.json();
        
        const {title, description} = body;

        if(!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({message: "Invalid or missing userId"}),  {status: 400 });
        }
        await connectDB();

        const user = await User.findById(userId);

        if(!user) {
            return new NextResponse(JSON.stringify({message: "User not found"}),  {status: 404 });
        }

        const newNote = new Note({
            title: title,
            description: description,
            user: new Types.ObjectId(userId)
        });

        await newNote.save();
        return new NextResponse(JSON.stringify({message: "Note created successfully", note: newNote}), { status: 201 });
    } catch (error) {
        return new NextResponse("Error creating note: " + error, { status: 500 });
    }
}

export const PATCH = async (req: Request) => {
    try {
        const body = await req.json();

        const { noteId, title, description} = body;

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        
        if( !noteId || !Types.ObjectId.isValid(noteId) ) {
            return new NextResponse(JSON.stringify( { message: "Note not found" } ),  {status: 404 });                    
        }

        if( !userId || !Types.ObjectId.isValid(userId) ) {
            return new NextResponse(JSON.stringify( { message: "User not found" } ),  {status: 404 });          
        }
        await connectDB();

        const user = await User.findById(userId);

        if( !user ) {
            return new NextResponse(JSON.stringify( { message: "User not found" } ),  {status: 404 });
        }

        const note = await Note.findOne({ _id: noteId, user: userId });

        if(!note) {
            return new NextResponse(JSON.stringify( { message: "Note not found" } ),  {status: 404 });
        }

        const updatedNote = await Note.findByIdAndUpdate(noteId, {
            title,
            description
        })

        await updatedNote.save();

        return new NextResponse(JSON.stringify( { message: "Note updated successfully", note: updatedNote } ), { status: 200 });
    } catch (error) {
        return new NextResponse( "Error updating note: " + error, { status: 500 } );
    }
}