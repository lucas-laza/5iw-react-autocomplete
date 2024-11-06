import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import Autocomplete from "./Component/Autocomplete";
import { faDollar, faUser } from "@fortawesome/free-solid-svg-icons";
import ProductTemplate from "./Component/ProductTemplate";

const dataExemple = [
  "Pomme",
  "Banane",
  "Poire",
  "Pasteque"
];

async function fetchUsers() {
  try {
    const response = await fetch("http://localhost:3003/users/1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error("Erreur");
    }

    const data = await response.json();

    return data.data.map(user => ({
      text: `${user.firstName} ${user.lastName}`,
      icon: faUser,
    }));
  } catch (error) {
    console.error("Erreur de fetch:", error);
    return [];
  }
}

async function fetchProducts() {
  try {
    const response = await fetch("http://localhost:3003/products/1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error("Erreur");
    }

    const data = await response.json();

    return data.data.map(product => ({
      text: `${product.name} ${product.price}$`,
      icon: faDollar,
    }));
  } catch (error) {
    console.error("Erreur de fetch:", error);
    return [];
  }
}

async function fetchProductsRaw() {
  try {
    const response = await fetch("http://localhost:3003/products/1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error("Erreur");
    }

    const data = await response.json();

    return data.data;
  } catch (error) {
    console.error("Erreur de fetch:", error);
    return [];
  }
}

function App() {
  return (
    <StrictMode>
      <p>1. Autocomplete user simple avec data en props</p>
      <Autocomplete data={dataExemple} />
      
      <p> 2. Autocomplete User simple avec data en fonction </p>
      <Autocomplete data={fetchUsers} />

      <p> 3. Autocomplete User multiple avec data en fonction </p>
      <Autocomplete data={fetchUsers} isMultiple={true}/> 

      <p> 4. Autocomplete Product simple avec data en fonction </p>
      <Autocomplete data={fetchProducts} />

      <p> 5. Autocomplete Product multiple avec data en fonction </p>
      <Autocomplete data={fetchProducts} isMultiple={true}/> 

      <p> 6. Autocomplete Mix multiple avec data en fonction </p>
      <Autocomplete data={[fetchProducts, fetchUsers, dataExemple]} isMultiple={true}/> 

      <p>7. Autocomplete Product multiple avec template et data en fonction </p>
      <Autocomplete data={fetchProductsRaw} isMultiple={true} template={ProductTemplate} />


      <p>vide</p>
      <Autocomplete data={[]} />
    </StrictMode>
  );
}

createRoot(document.getElementById("root")).render(<App />);
