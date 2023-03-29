import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { useUserStore, useProjectStore } from "../../store/store";

import { gapiDriveLoad, gapiPickerLoad } from "../api/google";

const MainInit = () => {
  const setProjects = useProjectStore((state) => state.setProjects);
  const setUserDetails = useUserStore((state) => state.setUserDetails);

  useEffect(() => {
    const fetchData = async () => {
      await setUserDetails();
      await setProjects();

      await gapiPickerLoad();
      await gapiDriveLoad();
    };

    fetchData();
  }, []);

  return <Outlet />;
};

export default MainInit;
