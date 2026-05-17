import { useEffect, useState } from "react";
import { CarListContext } from "./CarListContext.js";

function parseBackendError(responseJson) {
  if (responseJson.code === "dtoInIsNotValid" && Array.isArray(responseJson.validationError)) {
    const messages = responseJson.validationError.map((err) => {
      const path = err.instancePath || "";
      
      if (path.includes("SPZ")) {
        return "❌ SPZ: Musí mít maximálně 7 znaků a být zadána bez mezer.";
      }
      if (path.includes("VIN")) {
        return "❌ VIN: Musí mít přesně 17 znaků (kombinace čísel a velkých písmen).";
      }
      if (path.includes("model")) {
        return "❌ Model auta: Toto pole je povinné.";
      }
      if (path.includes("yearOfMake")) {
        return "❌ Rok výroby: Zadejte platný rok (pouze čísla).";
      }
      return `❌ ${err.message || "Chyba v zadání dat."}`;
    });
    return messages.join("\n");
  }

  if (responseJson.message) {
    const msg = responseJson.message.toLowerCase();
    if (msg.includes("unique") || msg.includes("already exists") || msg.includes("existuje")) {
      return "❌ Auto s tímto VIN nebo SPZ již v databázi existuje.";
    }
    return `❌ ${responseJson.message}`;
  }

  return "❌ Nepodařilo se uložit vozidlo. Zkontrolujte unikátnost VIN a SPZ.";
}

function CarListProvider({ children }) {
  const [carLoadObject, setCarLoadObject] = useState({
    state: "ready",
    error: null,
    data: [],
  });

  useEffect(() => {
    handleLoad();
  }, []);

  async function handleLoad() {
    setCarLoadObject((current) => ({ ...current, state: "pending" }));
    const response = await fetch(`http://localhost:8000/car/list`, { method: "GET" });
    const responseJson = await response.json();
    if (response.status < 400) {
      setCarLoadObject({ state: "ready", data: responseJson });
    } else {
      setCarLoadObject((current) => ({
        state: "error",
        data: current.data,
        error: responseJson.error,
      }));
    }
  }

  async function handleCreate(dtoIn) {
    setCarLoadObject((current) => ({ ...current, state: "pending" }));
    const response = await fetch(`http://localhost:8000/car/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dtoIn),
    });
    const responseJson = await response.json();

    if (response.status < 400) {
      setCarLoadObject((current) => ({
        state: "ready",
        data: [...current.data, responseJson],
      }));
      return responseJson;
    } else {
      setCarLoadObject((current) => ({ ...current, state: "ready" }));
      throw new Error(parseBackendError(responseJson));
    }
  }

  async function handleUpdate(dtoIn) {
    setCarLoadObject((current) => ({ ...current, state: "pending" }));
    const response = await fetch(`http://localhost:8000/car/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dtoIn),
    });
    const responseJson = await response.json();

    if (response.status < 400) {
      setCarLoadObject((current) => {
        const carIndex = current.data.findIndex((e) => e.id === responseJson.id);
        const newData = [...current.data];
        newData[carIndex] = responseJson;
        return { state: "ready", data: newData };
      });
      return responseJson;
    } else {
      setCarLoadObject((current) => ({ ...current, state: "ready" }));
      throw new Error(parseBackendError(responseJson));
    }
  }

  async function handleDelete(dtoIn) {
    const response = await fetch(`http://localhost:8000/car/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dtoIn),
    });

    if (response.ok) {
      setCarLoadObject((current) => ({
        ...current,
        state: "ready",
        data: current.data.filter((car) => car.id !== dtoIn.id),
      }));
    } else {
      const responseJson = await response.json();
      throw new Error(responseJson.message || "Nepodařilo se smazat auto");
    }
  }

  const value = {
    state: carLoadObject.state,
    carList: carLoadObject.data || [],
    handlerMap: { handleCreate, handleUpdate, handleDelete },
  };

  return <CarListContext.Provider value={value}>{children}</CarListContext.Provider>;
}

export default CarListProvider;