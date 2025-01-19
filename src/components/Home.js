import { Button, ListGroup } from "react-bootstrap";
import Header from "./Header";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { createShoppingList, getAllShoppingList } from "../db";
import { sendNotification } from "./Notification";

export default function Home() {
    const [shoppingLists, setShoppingLists] = useState([{
        id: "",
        title: "",
    }]);

    const fetchShoppingList = async () => {
        try {
            const response = await fetch("https://slpwaapi-production.up.railway.app/shoppingList/all");
            if (response.status === 200) {
                const data = await response.json();
                setShoppingLists(data);

                // Save to IndexedDB if the data doesn't exist already
                const existingData = await getAllShoppingList();
                if (existingData.length === 0) {
                    data.forEach(list => createShoppingList(list.title, list.createdAt));
                }
            } else {
                console.error("Failed to fetch shopping lists:", response.statusText);
            }
        } catch (error) {
            console.error("Fetching-Backend Error:", error);
            // When the app is offline, retrieve from IndexedDB
            const offlineData = await getAllShoppingList();
            setShoppingLists(offlineData);
        }
    };

    const handleRemove = async (id) => {
        console.log(id);
        try {
            // Make the DELETE request to the API with the given item ID
            const response = await fetch(`https://slpwaapi-production.up.railway.app/shoppingList/${id}`, {
                method: 'DELETE',
            });

            if (response.status === 200) {
                console.log(`Item with ID ${id} removed successfully`);

                // Notify user about the successful deletion
                const message = `Shopping list with ID ${id} deleted successfully.`;
                await sendNotification({ value: message });

                // Optionally, remove the list from the UI as well
                setShoppingLists((prevLists) => prevLists.filter(list => list.id !== id));
            } else {
                console.error(`Failed to remove item with ID ${id}:`, response.statusText);
            }
        } catch (error) {
            console.error(`Error removing item with ID ${id}:`, error);
        }
    };

    useEffect(() => {
        fetchShoppingList();
    }, []);

    // Request notification permission when the app is loaded
    useEffect(() => {
        const requestNotificationPermission = async () => {
            const permission = await Notification.requestPermission();
            if (permission === "granted") {
                console.log("Notification permission granted.");
            } else {
                console.log("Notification permission denied.");
            }
        };

        requestNotificationPermission();
    }, []);

    return (
        <div id={"ListDetailsPage"} className="container mx-auto min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow p-4 mt-5">
                {shoppingLists.length > 0 ? (
                    <ListGroup className={"mt-5"}>
                        {shoppingLists.map(list => (
                            <ListGroup.Item key={list.id} className="bg-light d-flex align-items-center justify-content-between mb-3 shadow-sm rounded border">
                                <Link to={`/shoppingList/${list.id}`} className="text-decoration-none text-start">
                                    <h3>{list.title}</h3>
                                </Link>
                                <Button className="float-end" variant="danger" onClick={() => handleRemove(list.id)}>
                                    <h5>Delete</h5>
                                </Button>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                ) : (
                    <p>Loading...</p>
                )}
            </main>
            <div className="fixed-bottom d-flex justify-content-center">
                <Link to="/listCreate" className={"w-50"}>
                    <Button className={"w-50"} style={{ marginBottom: "100px" }}>
                        <h4>Create New Shopping List</h4>
                    </Button>
                </Link>
            </div>
            <Footer />
        </div>
    );
}
