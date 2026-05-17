import { useContext, useState } from "react";
import { CarListContext } from "./CarListContext.js";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import CloseButton from "react-bootstrap/CloseButton";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

import Icon from "@mdi/react";
import { mdiLoading } from "@mdi/js";

function CarForm({ setShowCarForm, car }) {
  const { state, handlerMap } = useContext(CarListContext);
  const [showAlert, setShowAlert] = useState(null);
  const isPending = state === "pending";

  return (
    <Modal show={true} onHide={() => setShowCarForm(false)}>
      <Form
        onSubmit={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          var formData = Object.fromEntries(new FormData(e.target));
          formData.yearOfMake = Number(formData.yearOfMake);
          try {
            if (car.id) {
              formData.id = car.id;
              await handlerMap.handleUpdate(formData);
            } else {
              await handlerMap.handleCreate(formData);
            }
            setShowCarForm(false);
          } catch (err) {
            console.error(err);
            setShowAlert(err.message || "Neočekávaná chyba při ukládání.");
          }
        }}
      >
        <Modal.Header>
          <Modal.Title>{`${car.id ? "Upravit" : "Vytvořit"} vozidlo`}</Modal.Title>
          <CloseButton onClick={() => setShowCarForm(false)} />
        </Modal.Header>
        <Modal.Body style={{ position: "relative" }}>
          <Alert
            show={!!showAlert}
            variant="danger"
            dismissible
            onClose={() => setShowAlert(null)}
          >
            <Alert.Heading>Nepodařilo se uložit vozidlo</Alert.Heading>
            <pre>{showAlert}</pre>
          </Alert>

          {isPending ? (
            <div style={pendingStyle()}>
              <Icon path={mdiLoading} size={2} spin />
            </div>
          ) : null}

          <Form.Group className="mb-3" controlId="formVIN">
            <Form.Label>VIN</Form.Label>
            <Form.Control
              type="text"
              name="VIN"
              required
              defaultValue={car.VIN || ""}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formSPZ">
            <Form.Label>SPZ</Form.Label>
            <Form.Control
              type="text"
              name="SPZ"
              required
              defaultValue={car.SPZ || ""}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formModel">
            <Form.Label>Model auta</Form.Label>
            <Form.Control
              type="text"
              name="model"
              required
              defaultValue={car.model || ""}
              placeholder="Např. Octavia, Fabia..."
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPalivo">
            <Form.Label>Palivo</Form.Label>
            <Form.Select name="Palivo" defaultValue={car.Palivo || "Benzin"} required>
              <option value="Benzin">Benzin</option>
              <option value="Nafta">Nafta</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formYearOfMake">
            <Form.Label>Rok výroby</Form.Label>
            <Form.Control
              type="number"
              name="yearOfMake"
              required
              defaultValue={car.yearOfMake || ""}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowCarForm(false)}
            disabled={isPending}
          >
            Zavřít
          </Button>
          <Button type="submit" variant="primary" disabled={isPending}>
            {car.id ? "Upravit" : "Vytvořit"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

function pendingStyle() {
  return {
    position: "absolute",
    top: "0",
    right: "0",
    bottom: "0",
    left: "0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    opacity: "0.5",
    zIndex: 10,
  };
}

export default CarForm;