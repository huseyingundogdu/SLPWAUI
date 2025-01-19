import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import ListGroup from 'react-bootstrap/ListGroup';
import 'primeicons/primeicons.css';
import { useNavigate } from 'react-router-dom';
import {sendNotification} from "./Notification";

export default function ListCreate() {

    const navigate = useNavigate();
    const [marketListTitle, setMarketListTitle] = useState("");
    const [items, setItems] = useState([]);
    const [itemName, setItemName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [itemType, setItemType] = useState("");

    const handleAddItem = () => {
        if (itemName && quantity && itemType) {
            const newItem = {
                name: itemName,
                quantity: parseFloat(quantity),
                type: itemType,
            };
            setItems([...items, newItem]);
            setItemName("");
            setQuantity("");
            setItemType("");
        }
    };

    const handleSaveList = async () => {
        try {
            const response = await fetch("https://slpwaapi-production.up.railway.app/shoppingList", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: marketListTitle }),
            });

            if (!response.ok) {
                throw new Error("Failed to create the shopping list");
            }

            const data = await response.json();
            console.log("Response from shoppingList endpoint:", data);

            if (data.id) {

                const itemsWithListId = items.map(item => ({
                    ...item,
                    listId: data.id,
                }));

                const saveItemsResponse = await fetch(`https://slpwaapi-production.up.railway.app/item/saveAll/${data.id}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(itemsWithListId),
                });

                if (!saveItemsResponse.ok) {
                    throw new Error("Failed to save items");
                }

                const saveItemsData = await saveItemsResponse.json();
                console.log("Response from saveAll endpoint:", saveItemsData);


                const message = `New Shopping List with ${marketListTitle} name has been created successfully.`;
                await sendNotification({ value: message });

                navigate("/");

            } else {
                alert("Failed to retrieve the ID for the created list.");
            }
        } catch (error) {
            console.error("Error occurred:", error);
            alert("An error occurred while creating the list. Please try again later.");
        }
    };

    const handleRemoveItem = (index) => {
        const updatedItems = items.filter((item, i) => i !== index);
        setItems(updatedItems);
    };

    return (
        <div >
            <Header />
            <main className={"container"}>
                <h1 style={{ marginTop: "100px" }}>List Create</h1>

                <Form>
                    <div className={"bg-white p-2 rounded shadow-sm"}>
                    <Form.Group className="mb-3 d-flex align-items-center" controlId="formGroupEmail">
                        <Form.Label className={"my-auto"}>
                            <h2>Title :</h2>
                        </Form.Label>
                        <Form.Control
                            className={"w-25 ms-2"}
                            type="text"
                            placeholder="Give a title for your shopping."
                            value={marketListTitle}
                            onChange={e => setMarketListTitle(e.target.value)}
                        />
                        <Link className={"ms-auto"}>
                            <Button className={"bg-success"} onClick={handleSaveList}>Save</Button>
                        </Link>
                    </Form.Group>

                    <Form.Group className="mb-3 d-flex align-items-center" controlId="formGroupItem">
                        <Form.Label className={"my-auto"}>
                            <h4>Item Name :</h4>
                        </Form.Label>
                        <Form.Control
                            className={"w-25 ms-2 me-3"}
                            type="text"
                            placeholder="Give a name for your item."
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                        />
                        <Form.Label className={"my-auto"}>
                            <h4>Quantity :</h4>
                        </Form.Label>
                        <Form.Control
                            className={"w-25 ms-2"}
                            type="number"
                            placeholder="Amount of item"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                        <Form.Select
                            aria-label="Default select example"
                            className={"ms-2"}
                            style={{ width: '10%' }}
                            value={itemType}
                            onChange={(e) => setItemType(e.target.value)}
                        >
                            <option>Unit</option>
                            <option value="gram">Gram</option>
                            <option value="piece">Piece</option>
                            <option value="liter">Liter</option>
                        </Form.Select>
                        <Button onClick={handleAddItem} className={"ms-2"}>Add Item</Button>
                    </Form.Group>
                    </div>
                    <hr />

                    <ListGroup as="ul">
                        {items.map((item, index) => (
                            <ListGroup.Item className={"text-start"} key={index}>
                                <div className="d-flex align-items-center">
                                    <h6>{index + 1}. {item.name} {item.quantity} ({item.type})</h6>
                                    <Button
                                        variant="outline-danger"
                                        onClick={() => handleRemoveItem(index)}
                                        className="ms-auto"
                                    >
                                        <i className="pi pi-trash"></i>
                                    </Button>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Form>
            </main>
            <Footer />
        </div>
    );
}
