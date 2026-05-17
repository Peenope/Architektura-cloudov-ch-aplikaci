import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import Layout from "./Layout";
import CarListProvider from "./CarListProvider";
import CarProvider from "./CarProvider";
import CarRoute from "./CarRoute";
import RideListProvider from "./RideListProvider";

function App() {
  return (
    <div style={componentStyle()}>
      <CarListProvider>
        <RideListProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route
                  path="carDetail"
                  element={
                    <CarProvider>
                      <CarRoute />
                    </CarProvider>
                  }
                />
                <Route path="*" element={"Stránka nenalezena (404)"} />
              </Route>
            </Routes>
          </BrowserRouter>
        </RideListProvider>
      </CarListProvider>
    </div>
  );
}

function componentStyle() {
  return {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    backgroundColor: "#31393C",
  };
}

export default App;