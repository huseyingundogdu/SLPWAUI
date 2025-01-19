import React, { useEffect, useState } from 'react';
import Header from "./Header";
import Footer from "./Footer";
import {Button, ListGroup} from "react-bootstrap";
import {Link, useParams} from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { FaShareNodes } from "react-icons/fa6";
import { TfiSharethis } from "react-icons/tfi";




function ListDetailPage() {
    const { id } = useParams();  // Get the shopping list ID from the URL
    const [shoppingList, setShoppingList] = useState([]);  // State for storing shopping list data
    const [selectedItems, setSelectedItems] = useState([]); // State to track selected items

    // Fetch shopping list details from the server
    const fetchShoppingListDetails = async () => {
        try {
            const response = await fetch(`http://localhost:8080/shoppingList/${id}`);
            if (response.status === 200) {
                const data = await response.json();
                setShoppingList(data);
                console.log(data, "fetched data");
            } else {
                console.error("Failed to fetch shopping lists:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching shopping lists:", error);
        }
    };

    // Fetch the shopping list data when the component mounts or when `id` changes
    useEffect(() => {
        fetchShoppingListDetails();
    }, [id]);

    // Toggle the selection state of an item
    const handleItemClick = (itemId) => {
        setSelectedItems((prevSelectedItems) => {
            if (prevSelectedItems.includes(itemId)) {
                // Deselect the item if it's already selected
                return prevSelectedItems.filter(id => id !== itemId);
            } else {
                // Select the item if it's not selected
                return [...prevSelectedItems, itemId];
            }
        });
    };

    // Finish Button
    const handleFinish = async () => {
        // Check if all items are selected
        if (selectedItems.length !== shoppingList.items.length) {
            const proceed = window.confirm(
                "You haven't bought all the items. Are you sure you want to finish shopping?"
            );
            if (!proceed) {
                // User canceled, do nothing
                return;
            }
        }

        try {
            // Make an API call to delete the shopping list
            const response = await fetch(`http://localhost:8080/shoppingList/${id}`, {
                method: "DELETE",
            });

            if (response.status === 200) {
                alert("Shopping list finished and deleted successfully!");
                // Redirect to home page
                window.location.href = "/";
            } else {
                alert("Failed to delete the shopping list. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting the shopping list:", error);
            alert("An error occurred. Please try again later.");
        }
    };



    //Notification

    const shareHandle = async () => {
        try {
            await navigator.share({
                title: shoppingList.title,
                text: shoppingList.title,
                url: `http://localhost:3000/shoppingList/${id}`,
            });

        }catch (error) {
            console.error("Error fetching shopping lists:", error);
        }
    }

    return (

        <div className="container mx-auto min-h-screen flex flex-col ">
            <Header/>
            <main className="flex-grow p-4 mt-5">
                <h1 className={"mt-5"}>Shopping Title : {shoppingList.title}</h1>
                <h6>Date: {new Date(shoppingList.createdAt).toLocaleDateString()}</h6>

                {/* Check if the shopping list has items */}
                {shoppingList.items && shoppingList.items.length > 0 ? (
                    <ListGroup>
                        {/* Table headers */}
                        <tr className="d-flex bg-primary text-white rounded">
                            <th>#</th>
                            <th>Product Name</th>
                            <th>and</th>
                            <th>Quantity</th>
                        </tr>

                        {/* Loop through items and render each one */}
                        {shoppingList.items.map((item, index) => (
                            <ListGroup.Item
                                className={` text-primary list-group-item list-group-item-action shadow-sm ${selectedItems.includes(item.id) ? 'list-group-item-primary' : ''}`}
                                key={item.id}
                                style={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    marginBottom: '10px',
                                }}
                                onClick={() => handleItemClick(item.id)}  // Handle item click
                            >
                                <h4>{index + 1}-</h4>
                                <h6 className="ms-1">{item.name}</h6>
                                <h6 className="ms-3">{item.quantity}</h6>
                                <h6 className="ms-1">{item.type}</h6>
                                {selectedItems.includes(item.id) && (
                                    <span className="ms-3 badge text-bg-success rounded-pill">done</span>
                                )}

                                <FaShoppingCart className="fs-1 ms-auto "/>
                                {/* Conditionally render the icon with transition effect */}
                                {selectedItems.includes(item.id) && (
                                    <FaCheck className="fs-1 ms-3 text-success "/>
                                )}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>

                ) : (
                    <p>No items available.</p>
                )}
            </main>
            <div className=" fixed-bottom d-flex justify-content-center">
                <Link className={"me-2"}>
                    <Button  style={{marginBottom: "100px"}} onClick={handleFinish}><h4>Finish the Shopping List</h4>
                    </Button>
                </Link>

                <Button className={"border-2"} variant="outline-primary" style={{marginBottom: "100px"}} onClick={shareHandle}><TfiSharethis />
                </Button>

            </div>
            <Footer/>
        </div>
    );
}

export default ListDetailPage;
