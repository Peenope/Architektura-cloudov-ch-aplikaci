import { useState } from "react";
import CarList from "./CarList";
import RideList from "./RideList";
import Button from "react-bootstrap/Button";

function HomePage() {
  const [showCarList, setShowCarList] = useState(true);

  return (
    <div>
      <div style={buttonContainerStyle()}>
        <Button variant={showCarList ? "primary" : "outline-primary"} onClick={() => setShowCarList(true)}>Vozidla</Button>
        <Button variant={!showCarList ? "primary" : "outline-primary"} onClick={() => setShowCarList(false)}>Jízdy</Button>
      </div>
      {showCarList ? <CarList /> : <RideList />}
    </div>
  );
}

function buttonContainerStyle() {
  return {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
    gap: "10px",
  };
}

export default HomePage;