export const sendNotification = async ({ value }) => {
    try {
        // Check if the browser supports notifications
        if (!("Notification" in window)) {
            console.warn("Your browser does not support notifications.");
            return;
        }

        // Make sure the user has granted permission to show notifications
        const permission = await Notification.requestPermission();

        if (permission === "granted") {
            // Show the notification
            new Notification("You have Notification", {
                body: value,
                icon: '/icon.png', // Add your own icon here
                badge: '/badge.png', // Optionally set a badge
                requireInteraction: true, // Makes the notification persist until the user interacts with it
                // Use the bold text for title
                title: `<strong>You have Notification</strong>`, // Or use <b> for bold
            });
        } else {
            console.log("Notification permission denied.");
        }
    } catch (error) {
        console.error("Error while sending notification:", error);
    }
};
