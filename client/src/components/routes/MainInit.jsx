import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { useUserStore, useProjectStore } from "../../store/store";

const MainInit = () => {
  const setProjects = useProjectStore((state) => state.setProjects);
  const setUserDetails = useUserStore((state) => state.setUserDetails);

  useEffect(() => {
    const fetchData = () => {
      setUserDetails();
      setProjects();
    };

    fetchData();
  }, []);

  return <Outlet />;
};

export default MainInit;
