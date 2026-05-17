import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import CloseButton from "react-bootstrap/CloseButton";

function ConfirmDeleteDialog({ setShowConfirmDeleteDialog, car, onConfirm }) {
  return (
    <Modal show={true} onHide={() => setShowConfirmDeleteDialog(false)}>
      <Modal.Header>
        <Modal.Title>Smazat vozidlo</Modal.Title>
        <CloseButton onClick={() => setShowConfirmDeleteDialog(false)} />
      </Modal.Header>
      <Modal.Body>
        Opravdu chcete smazat vozidlo {car ? car.SPZ : ""}?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowConfirmDeleteDialog(false)}>
          Zavřít
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Smazat
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmDeleteDialog;