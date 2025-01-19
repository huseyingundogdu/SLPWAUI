import { useEffect } from "react";

export default function Header() {
    useEffect(() => {
        const connectionStatus = document.getElementById("connection-status");

        // Function to update connection status
        const updateConnectionStatus = () => {
            if (navigator.onLine) {
                connectionStatus.textContent = 'You are Online';
                connectionStatus.classList.remove('bg-danger');
                connectionStatus.classList.add('bg-success');
            } else {
                connectionStatus.textContent = 'You are Offline';
                connectionStatus.classList.remove('bg-success');
                connectionStatus.classList.add('bg-danger');
            }
        };

        // Initially set the connection status
        updateConnectionStatus();

        // Listen for changes to online/offline status
        window.addEventListener('online', updateConnectionStatus);
        window.addEventListener('offline', updateConnectionStatus);

        // Cleanup event listeners on unmount
        return () => {
            window.removeEventListener('online', updateConnectionStatus);
            window.removeEventListener('offline', updateConnectionStatus);
        };
    }, []);

    return (
        <header className="w-full h-20 bg-primary text-white flex items-center justify-between px-6 fixed-top shadow-md pt-1 pb-1">
            <div className="text-lg font-bold">
                <h1>Shopping Lists</h1>
                <div id="connection-status" className="flex items-center justify-between bg-success">
                    You are online
                </div>
            </div>
        </header>
    );
}
