import { Request, Response } from "express";
import ContactMessage from "../models/ContactMessage";

export const sendContactMessage = async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newMessage = new ContactMessage({ name, email, message });
    await newMessage.save();

    console.log("Saved new contact message:", newMessage);

    return res.status(200).json({ message: "Message sent successfully!" });
  } catch (err) {
    console.error("Error saving contact message:", err);
    return res.status(500).json({ message: "Failed to send message" });
  }
};