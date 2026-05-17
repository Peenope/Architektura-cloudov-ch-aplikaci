import { useContext, useState } from "react";
import { RideListContext } from "./RideListContext";
import { CarListContext } from "./CarListContext";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import CloseButton from "react-bootstrap/CloseButton";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Icon from "@mdi/react";
import { mdiLoading } from "@mdi/js";

function RideForm({ setShowRideForm, ride }) {
  const { state, handlerMap } = useContext(RideListContext);
  const { carList } = useContext(CarListContext);
  const [showAlert, setShowAlert] = useState(null);
  const isPending = state === "pending";

  return (
    <Modal show={true} onHide={() => setShowRideForm(false)}>
      <Form
        onSubmit={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          const formData = Object.fromEntries(new FormData(e.target));
          formData.date = new Date(formData.date).toISOString();
          formData.kilometers_start = Number(formData.kilometers_start);
          formData.kilometers_end = Number(formData.kilometers_end);
          try {
            if (ride.id) {
              formData.id = ride.id;
              await handlerMap.handleUpdate(formData);
            } else {
              await handlerMap.handleCreate(formData);
            }
            setShowRideForm(false);
          } catch (err) {
            setShowAlert(err.message || "Chyba při ukládání jízdy.");
          }
        }}
      >
        <Modal.Header>
          <Modal.Title>{`${ride.id ? "Upravit" : "Vytvořit"} jízdu`}</Modal.Title>
          <CloseButton onClick={() => setShowRideForm(false)} />
        </Modal.Header>
        <Modal.Body style={{ position: "relative" }}>
          {showAlert && (
            <Alert variant="danger" dismissible onClose={() => setShowAlert(null)}>
              <pre style={{ margin: 0, whiteSpace: "pre-wraper" }}>{showAlert}</pre>
            </Alert>
          )}
          {isPending && (
            <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "white", opacity: "0.5", zIndex: 10 }}>
              <Icon path={mdiLoading} size={2} spin />
            </div>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Název jízdy</Form.Label>
            <Form.Control type="text" name="name" required defaultValue={ride.name || ""} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Datum jízdy</Form.Label>
            <Form.Control type="datetime-local" name="date" required defaultValue={ride.date ? rideDateToInput(ride.date) : ""} />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Jméno řidiče</Form.Label>
            <Form.Control type="text" name="id_driver" required defaultValue={ride.id_driver || ""} />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Kilometry začátek</Form.Label>
            <Form.Control type="number" name="kilometers_start" required defaultValue={ride.kilometers_start || ""} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Kilometry konec</Form.Label>
            <Form.Control type="number" name="kilometers_end" required defaultValue={ride.kilometers_end || ""} />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>SPZ vozidla</Form.Label>
            <Form.Select name="carSPZ" defaultValue={ride.carSPZ || (carList[0] ? carList[0].SPZ : "")} required>
              {carList.length === 0 ? (
                <option value="">-- Nejdříve musíte vytvořit vozidlo --</option>
              ) : (
                carList.map((car) => (
                  <option key={car.id} value={car.SPZ}>
                    {car.SPZ} ({car.model || "Bez modelu"})
                  </option>
                ))
              )}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRideForm(false)} disabled={isPending}>Zavřít</Button>
          <Button type="submit" variant="primary" disabled={isPending}>{ride.id ? "Upravit" : "Vytvořit"}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

function rideDateToInput(date) {
  date = new Date(date);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default RideForm;