import React from "react";
import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div
      className="text-center position-absolute top-50 start-50 translate-middle"
      id="error-page"
    >
      <h1 className="p-4">Uh-oh!</h1>
      <p className="p-3">Sorry, an unexpected error has occurred.</p>
      <p>
        Message:{" "}
        <i className="text-secondary">{error.statusText || error.message}</i>
      </p>
    </div>
  );
};

export default ErrorPage;
