import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Icon from "@mdi/react";
import { mdiCar } from "@mdi/js";
import Button from "react-bootstrap/Button";

function NavBar() {
  const navigate = useNavigate();

  return (
    <Navbar expand="lg" style={{ backgroundColor: "white" }}>
      <Container>
        <Navbar.Brand>
          <Button style={brandStyle()} onClick={() => navigate("/")}>
            <Icon path={mdiCar} size={1} color={"white"}/>
            Kniha jízd
          </Button>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}

function brandStyle() {
  return {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "white",
    backgroundColor: "black",
    border: "none",
  };
}

export default NavBar;