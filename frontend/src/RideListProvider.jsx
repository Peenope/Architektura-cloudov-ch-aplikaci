import { useEffect, useState } from "react";
import { RideListContext } from "./RideListContext.js";

function parseRideBackendError(responseJson) {
  if (responseJson.code === "dtoInIsNotValid" && Array.isArray(responseJson.validationError)) {
    const messages = responseJson.validationError.map((err) => {
      if (err.keyword === "additionalProperties" && err.params?.additionalProperty) {
        return `❌ Backend neakceptuje políčko: "${err.params.additionalProperty}". Toto pole v business modelu jízdy neexistuje.`;
      }

      const path = err.instancePath || "";
      if (path.includes("name")) return "❌ Název jízdy: Vyplňte platný název.";
      if (path.includes("date")) return "❌ Datum jízdy: Neplatný formát data a času.";
      if (path.includes("id_driver")) return "❌ Jméno řidiče: Toto pole je povinné.";
      if (path.includes("kilometers_start")) return "❌ Kilometry začátek: Musí být platné číslo.";
      if (path.includes("kilometers_end")) return "❌ Kilometry konec: Musí být platné číslo.";
      if (path.includes("carSPZ")) return "❌ SPZ vozidla: Vyberte platné vozidlo ze seznamu.";
      
      return `❌ ${err.message || "Chyba v zadání dat."}`;
    });
    return messages.join("\n");
  }

  if (responseJson.message) {
    return `❌ ${responseJson.message}`;
  }

  return "❌ Nepodařilo se uložit jízdu. Zkontrolujte správnost zadaných údajů.";
}

function RideListProvider({ children }) {
  const [rideLoadObject, setRideLoadObject] = useState({
    state: "ready",
    error: null,
    data: [],
  });

  useEffect(() => {
    handleLoad();
  }, []);

  async function handleLoad() {
    setRideLoadObject((current) => ({ ...current, state: "pending" }));
    const response = await fetch(`http://localhost:8000/ride/list`, { method: "GET" });
    const responseJson = await response.json();
    if (response.status < 400) {
      setRideLoadObject({ state: "ready", data: responseJson });
    } else {
      setRideLoadObject((current) => ({
        state: "error",
        data: current.data,
        error: responseJson.error,
      }));
    }
  }

  async function handleCreate(dtoIn) {
    setRideLoadObject((current) => ({ ...current, state: "pending" }));
    const response = await fetch(`http://localhost:8000/ride/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dtoIn),
    });
    const responseJson = await response.json();

    if (response.status < 400) {
      setRideLoadObject((current) => {
        const newData = [...current.data, responseJson];
        newData.sort((a, b) => new Date(a.date) - new Date(b.date));
        return { state: "ready", data: newData };
      });
      return responseJson;
    } else {
      setRideLoadObject((current) => ({ ...current, state: "ready" }));
      throw new Error(parseRideBackendError(responseJson));
    }
  }

  async function handleUpdate(dtoIn) {
    setRideLoadObject((current) => ({ ...current, state: "pending" }));
    const response = await fetch(`http://localhost:8000/ride/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dtoIn),
    });
    const responseJson = await response.json();

    if (response.status < 400) {
      setRideLoadObject((current) => {
        const rideIndex = current.data.findIndex((e) => e.id === responseJson.id);
        const newData = [...current.data];
        newData[rideIndex] = responseJson;
        newData.sort((a, b) => new Date(a.date) - new Date(b.date));
        return { state: "ready", data: newData };
      });
      return responseJson;
    } else {
      setRideLoadObject((current) => ({ ...current, state: "ready" }));
      throw new Error(parseRideBackendError(responseJson));
    }
  }

  async function handleDelete(dtoIn) {
    setRideLoadObject((current) => ({ ...current, state: "pending" }));
    const response = await fetch(`http://localhost:8000/ride/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dtoIn),
    });

    if (response.ok) {
      setRideLoadObject((current) => ({
        ...current,
        state: "ready",
        data: current.data.filter((e) => e.id !== dtoIn.id),
      }));
    } else {
      const responseJson = await response.json();
      throw new Error(responseJson.message || "Nepodařilo se smazat jízdu");
    }
  }

  const value = {
    state: rideLoadObject.state,
    rideList: rideLoadObject.data || [],
    handlerMap: { handleCreate, handleUpdate, handleDelete },
  };

  return <RideListContext.Provider value={value}>{children}</RideListContext.Provider>;
}

export default RideListProvider;