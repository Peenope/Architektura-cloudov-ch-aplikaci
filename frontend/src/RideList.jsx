import { useContext, useState } from "react";
import { RideListContext } from "./RideListContext.js";
import Button from "react-bootstrap/Button";
import RideCard from "./RideCard.jsx";
import RideForm from "./RideForm.jsx";
import Container from "react-bootstrap/Container";
import Icon from "@mdi/react";
import { mdiPlusBoxOutline } from "@mdi/js";

function RideList() {
  const { rideList } = useContext(RideListContext);
  const [showRideForm, setShowRideForm] = useState(false);

  const ridelist = rideList.filter((ride) => ride.id);

  return (
    <Container>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
        <Button variant="success" onClick={() => setShowRideForm({})}>
          <Icon path={mdiPlusBoxOutline} size={1} color={"white"} /> Nová jízda
        </Button>
      </div>
      {!!showRideForm && (
        <RideForm ride={showRideForm} setShowRideForm={setShowRideForm} />
      )}
      <div style={{ marginTop: "20px" }}>
        {ridelist.map((ride) => (
          <RideCard key={ride.id} ride={ride} setShowRideForm={setShowRideForm} />
        ))}
      </div>
    </Container>
  );
}

export default RideList;