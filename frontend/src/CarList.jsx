import { useContext, useState } from "react";
import { CarListContext } from "./CarListContext.js";
import Button from "react-bootstrap/Button";
import CarCard from "./CarCard.jsx";
import CarForm from "./CarForm.jsx";
import Container from "react-bootstrap/Container";
import Icon from "@mdi/react";
import { mdiPlusBoxOutline } from "@mdi/js";

function CarList() {
  const { carList } = useContext(CarListContext);
  const [showCarForm, setShowCarForm] = useState(false);

  const carlist = carList.filter((car) => car.id);

  return (
    <Container>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
        <Button variant="success" onClick={() => setShowCarForm({})}>
          <Icon path={mdiPlusBoxOutline} size={1} color={"white"} /> Nový vůz
        </Button>
      </div>
      {!!showCarForm && (
        <CarForm car={showCarForm} setShowCarForm={setShowCarForm} />
      )}
      <div style={{ marginTop: "20px" }}>
        {carlist.map((car) => (
          <CarCard key={car.id} car={car} setShowCarForm={setShowCarForm} />
        ))}
      </div>
    </Container>
  );
}

export default CarList;