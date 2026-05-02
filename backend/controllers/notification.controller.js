import { Notification } from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.id;
        const notifications = await Notification.find({ recipient: userId })
            .sort({ createdAt: -1 })
            .populate('sender', 'username profilepicture');

        return res.status(200).json({ notifications, success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
}

export const markAsRead = async (req, res) => {
    try {
        const userId = req.id;
        await Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });

        return res.status(200).json({ message: "Notifications marked as read", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
}
