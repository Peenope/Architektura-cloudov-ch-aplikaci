import { useState, useContext } from "react";
import Button from "react-bootstrap/Button";
import Icon from "@mdi/react";
import { mdiPencil, mdiTrashCanOutline } from "@mdi/js";
import ConfirmDeleteDialogRide from "./ConfirmDeleteDialogRide";
import { RideListContext } from "./RideListContext";

function RideCard({ ride, setShowRideForm }) {
  const { handlerMap } = useContext(RideListContext);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleDelete = async () => {
    try {
      await handlerMap.handleDelete({ id: ride.id });
    } catch (error) {
      console.error("Chyba při mazání jízdy:", error.message);
    } finally {
      showConfirmDialog(false);
    }
  };

  return (
    <div className="card border-0 shadow rounded" style={componentStyle()}>
      <div style={cardContentStyle()}>
        <div style={{ fontSize: "18px", fontWeight: "bold" }}>{ride.name}</div>
        <div style={spzStyle()}>SPZ vozidla: {ride.carSPZ}</div>
        <div>Datum jízdy: {new Date(ride.date).toLocaleDateString()}</div>
        <div>Kilometry start: {ride.kilometers_start} km</div>
        <div>Kilometry konec: {ride.kilometers_end} km</div>
      </div>
      <div style={buttonGroupStyle()}>
        <Button onClick={() => setShowRideForm(ride)} size={"sm"} variant="warning" className="mb-1">
          <Icon path={mdiPencil} size={0.7} />
        </Button>
        <Button onClick={() => setShowConfirmDialog(true)} size={"sm"} variant="danger">
          <Icon path={mdiTrashCanOutline} size={0.7} />
        </Button>
      </div>
      <ConfirmDeleteDialogRide
        show={showConfirmDialog}
        onHide={() => setShowConfirmDialog(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

function componentStyle() {
  return {
    margin: "12px auto",
    padding: "8px",
    display: "grid",
    gridTemplateColumns: "auto max-content",
    columnGap: "8px",
    maxWidth: "700px",
  };
}

function cardContentStyle() {
  return {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  };
}

function buttonGroupStyle() {
  return {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "5px"
  };
}

function spzStyle() {
  return {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#0056b3",
  };
}

export default RideCard;