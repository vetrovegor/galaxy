import { Slide, toast } from "react-toastify";

class NotificationsService {
    sendErrorResponseNotification(messages) {
        if (!Array.isArray(messages)) {
            messages = [messages];
        }

        messages.forEach(message =>
            toast.error(message, {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Slide,
            })
        );
    }

    sendSuccessNotification(message) {
        toast.success(message, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Slide,
        })
    }
}

export const notificationsService = new NotificationsService();