import { useContext } from "react";
import { CarContext } from "./CarContext";
import CarSPZVINBadge from "./CarSPZVINBadge";
import CarDetail from "./CarDetail";

function CarRoute() {
  const { car } = useContext(CarContext);

  return (
    <div className="card border-0 shadow rounded" style={componentStyle()}>
      {car ? (
        <>
          <CarSPZVINBadge car={car} />
          <CarDetail car={car} />
        </>
      ) : (
        <div style={{ color: "white" }}>Načítám detail auta...</div>
      )}
    </div>
  );
}

function componentStyle() {
  return {
    margin: "12px auto",
    padding: "16px",
    display: "grid",
    gridTemplateColumns: "max-content auto",
    columnGap: "20px",
    maxWidth: "700px",
    backgroundColor: "#444"
  };
}

export default CarRoute;