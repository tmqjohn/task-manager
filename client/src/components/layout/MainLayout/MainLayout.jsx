import React from "react";
import { Outlet } from "react-router-dom";

import SidePanel from "./SidePanel";
import Navbar from "./Navbar";

const MainLayout = () => {
  return (
    <main className="main-app container-fluid d-flex flex-column min-vh-100">
      {/***************** navbar / header section *****************/}
      <header>
        <Navbar />
      </header>

      {/****************** projects section *****************/}

      {/* side panel / left panel */}
      <div className="projects-main d-flex flex-fill">
        <SidePanel />

        {/* main panel / right panel */}
        <section className="main-panel d-flex flex-column flex-fill">
          <Outlet />
        </section>
      </div>
    </main>
  );
};

export default MainLayout;
