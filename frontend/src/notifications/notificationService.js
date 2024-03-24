import { Slide, toast } from "react-toastify";

const options = {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Slide,
};

class NotificationsService {
    sendErrorResponseNotification(messages) {
        if (!Array.isArray(messages)) {
            messages = [messages];
        }

        messages.forEach(message =>
            toast.error(message, options)
        );
    }

    sendSuccessNotification(message) {
        toast.success(message, options)
    }
}

export const notificationsService = new NotificationsService();