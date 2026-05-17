import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import CarSPZVINBadge from "./CarSPZVINBadge";
import Icon from "@mdi/react";
import { mdiEyeOutline, mdiPencil, mdiTrashCanOutline } from "@mdi/js";
import { useContext, useState } from "react";
import { CarListContext } from "./CarListContext.js";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog.jsx";

function CarCard({ car, setShowCarForm }) {
  const navigate = useNavigate();
  const { handlerMap } = useContext(CarListContext);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleDelete = async () => {
    try {
      await handlerMap.handleDelete({ id: car.id });
    } catch (error) {
      console.error("Chyba při mazání auta:", error.message);
    } finally {
      setShowConfirmDialog(false);
    }
  };

  return (
    <div className="card border-0 shadow rounded" style={componentStyle()}>
      <CarSPZVINBadge car={car} />
      
      <div style={contentStyle()}>
        <div style={{ fontSize: "22px", fontWeight: "bold", color: "#2b2d42" }}>
          {car.model || "Model neuveden"}
        </div>
      </div>

      <div style={{ display: "grid", gap: "2px", justifyContent: "right", alignItems: "center" }}>
        <Button onClick={() => navigate("/carDetail?id=" + car.id)} size={"sm"}>
          <Icon path={mdiEyeOutline} size={0.7} />
        </Button>
        <Button onClick={() => setShowCarForm(car)} size={"sm"}>
          <Icon path={mdiPencil} size={0.7} />
        </Button>
        <Button onClick={() => setShowConfirmDialog(true)} size={"sm"} variant="danger">
          <Icon path={mdiTrashCanOutline} size={0.7} />
        </Button>
      </div>

      {showConfirmDialog && (
        <ConfirmDeleteDialog
          setShowConfirmDeleteDialog={setShowConfirmDialog}
          car={car}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

function componentStyle() {
  return {
    margin: "12px auto",
    padding: "8px",
    display: "grid",
    gridTemplateColumns: "max-content auto 32px",
    columnGap: "8px",
    maxWidth: "700px",
    backgroundColor: "#ffffff"
  };
}

function contentStyle() {
  return {
    display: "flex",
    alignItems: "center",
    paddingLeft: "24px",
  };
}

export default CarCard;