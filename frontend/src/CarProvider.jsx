import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CarContext } from "./CarContext.js";

function CarProvider({ children }) {
  const [carLoadObject, setCarLoadObject] = useState({
    state: "ready",
    error: null,
    data: null,
  });
  const location = useLocation();

  useEffect(() => {
    handleLoad();
  }, [location.search]);

  async function handleLoad() {
    setCarLoadObject((current) => ({ ...current, state: "pending" }));
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("id");

    const response = await fetch(`http://localhost:8000/car/get?id=${id}`, { method: "GET" });
    const responseJson = await response.json();
    if (response.status < 400) {
      setCarLoadObject({ state: "ready", data: responseJson });
    } else {
      setCarLoadObject({
        state: "error",
        data: null,
        error: responseJson.error,
      });
    }
  }

  const value = { car: carLoadObject.data };
  return <CarContext.Provider value={value}>{children}</CarContext.Provider>;
}

export default CarProvider;