import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { message } = req.body;

    

        // Validate input
        if (!message) {
            return res.status(400).json({ error: 'Message content is required' });
        }

        let gotConversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!gotConversation) {
            gotConversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
            console.log('New conversation created:', gotConversation);
        } else {
            console.log('Existing conversation found:', gotConversation);
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message,
        });

        if (newMessage) {
            gotConversation.messages.push(newMessage._id);
        } else {
            return res.status(500).json({ error: 'Failed to create message' });
        }

        await Promise.all([gotConversation.save(), newMessage.save()]);

        return res.status(201).json({
            newMessage,
        });
    } catch (error) {
        console.log('Error in sendMessage:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
export const getMessage = async (req,res) => {
    try {
        const receiverId = req.params.id;
        const senderId = req.id;
        const conversation = await Conversation.findOne({
            participants:{$all : [senderId, receiverId]}
        }).populate("messages"); 
        return res.status(200).json(conversation?.messages);
    } catch (error) {
        console.log(error);
    }
}