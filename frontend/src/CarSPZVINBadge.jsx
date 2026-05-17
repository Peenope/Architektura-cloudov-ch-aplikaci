function CarSPZVINBadge({ car }) {
  return (
    <div className={"rounded"} style={{ width: "300px", backgroundColor: "#3FA7D6", display: "grid", height: "max-content" }}>
      <div style={{ display: "flex", justifyContent: "center", padding: "8px", fontSize: "22px", color: "white", lineHeight: 1 }}>
        <div>{car.SPZ}</div>
      </div>
      <div className={"rounded-bottom"} style={{ display: "flex", justifyContent: "center", fontSize: "20px", lineHeight: 1, padding: "4px 4px 8px 4px", background: "#000000", color: "white" }}>
        <div>{car.VIN}</div>
      </div>
    </div>
  );
}
export default CarSPZVINBadge;