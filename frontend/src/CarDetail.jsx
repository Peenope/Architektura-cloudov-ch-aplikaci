import { useContext } from "react";
import { RideListContext } from "./RideListContext.js"; 
import Icon from "@mdi/react";
import { mdiCar } from "@mdi/js";

function CarDetail({ car }) {
  const { rideList } = useContext(RideListContext);

  const carRides = Array.isArray(rideList)
    ? rideList.filter((ride) => ride && ride.carSPZ === car.SPZ)
    : [];

  const currentKilometers = carRides.reduce((max, ride) => {
    return ride.kilometers_end > max ? ride.kilometers_end : max;
  }, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%", boxSizing: "border-box", padding: "8px" }}>
      
      <div style={detailContainerStyle()}>
        <div style={{ display: "grid", rowGap: "6px" }}>
          <div style={modelTitleStyle()}>
            {car.model || "Model neuveden"}
          </div>
          <div style={infoLineStyle()}>
            <strong>VIN:</strong> {car.VIN}
          </div>
          <div style={infoLineStyle()}>
            <strong>Palivo:</strong> {car.Palivo}
          </div>
          <div style={infoLineStyle()}>
            <strong>Rok výroby:</strong> {car.yearOfMake}
          </div>
          <div style={mileageLineStyle()}>
            <strong>Najeté kilometry:</strong> {currentKilometers.toLocaleString()} km
          </div>
        </div>
        
        <div style={iconWrapperStyle()}>
          <Icon path={mdiCar} size={4.5} color="#3FA7D6" />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", boxSizing: "border-box" }}>
        <div style={historyTitleStyle()}>Historie jízd tohoto vozidla</div>
        
        {carRides.length === 0 ? (
          <div style={noRidesStyle()}>
            Pro toto vozidlo nebyly v knize jízd zatím zaznamenány žádné cesty.
          </div>
        ) : (
          <div style={tableWrapperStyle()}>
            <table style={tableStyle()}>
              <thead>
                <tr style={tableHeaderStyle()}>
                  <th style={thStyle()}>Datum a čas</th>
                  <th style={thStyle()}>Účel / Název jízdy</th>
                  <th style={thStyle()}>Odkud (km)</th>
                  <th style={thStyle()}>Dokud (km)</th>
                  <th style={thStyle()}>Ujeto</th>
                </tr>
              </thead>
              <tbody>
                {carRides.map((ride) => {
                  const tripDistance = ride.kilometers_end - ride.kilometers_start;
                  return (
                    <tr key={ride.id} style={tableRowStyle()}>
                      <td style={tdStyle()}>{formatDate(ride.date)}</td>
                      <td style={tdStyle()}>{ride.name}</td>
                      <td style={tdStyle()}>{ride.kilometers_start.toLocaleString()} km</td>
                      <td style={tdStyle()}>{ride.kilometers_end.toLocaleString()} km</td>
                      <td style={{ ...tdStyle(), fontWeight: "bold", color: "#3FA7D6" }}>
                        +{tripDistance} km
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

function formatDate(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleDateString("cs-CZ") + " " + d.toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" });
}

function detailContainerStyle() {
  return {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    boxSizing: "border-box",
    gap: "20px",
    paddingBottom: "20px",
    borderBottom: "1px solid #444444"
  };
}

function modelTitleStyle() {
  return {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#3FA7D6",
    marginBottom: "4px"
  };
}

function infoLineStyle() {
  return {
    fontSize: "18px",
    color: "#cccccc"
  };
}

function mileageLineStyle() {
  return {
    fontSize: "19px",
    color: "#2ec4b6",
    fontWeight: "600",
    marginTop: "4px"
  };
}

function tableWrapperStyle() {
  return {
    overflowX: "auto",
    width: "100%",
    boxSizing: "border-box",
    borderRadius: "8px",
    border: "1px solid #2d2e33"
  };
}

function tableStyle() {
  return {
    width: "100%",
    borderCollapse: "collapse",
    color: "#dddddd",
    backgroundColor: "#1c1d22",
    fontSize: "14px",
    boxSizing: "border-box"
  };
}

function iconWrapperStyle() {
  return {
    opacity: 0.35,
    display: "flex",
    alignItems: "center"
  };
}

function historyTitleStyle() {
  return {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#ffffff"
  };
}

function noRidesStyle() {
  return {
    color: "#888888",
    fontStyle: "italic",
    padding: "12px",
    backgroundColor: "#1e1e24",
    borderRadius: "6px",
    width: "100%",
    boxSizing: "border-box"
  };
}

function tableHeaderStyle() {
  return {
    backgroundColor: "#24252a",
    textAlign: "left",
    borderBottom: "2px solid #3a3b40"
  };
}

function thStyle() {
  return {
    padding: "10px 12px",
    fontWeight: "600",
    color: "#ffffff",
    whiteSpace: "nowrap"
  };
}

function tdStyle() {
  return {
    padding: "10px 12px",
    borderBottom: "1px solid #2d2e33"
  };
}

function tableRowStyle() {
  return {
    transition: "background-color 0.2s"
  };
}

export default CarDetail;