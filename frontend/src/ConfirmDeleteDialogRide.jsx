import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function ConfirmDeleteDialogRide({ show, onHide, onConfirm }) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Potvrdit smazání</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Opravdu chcete vymazat tuto jízdu?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Zavřít
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Vymazat
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmDeleteDialogRide;