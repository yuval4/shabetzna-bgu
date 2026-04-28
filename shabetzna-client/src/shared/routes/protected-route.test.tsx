import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { setLocalStorage, USER_TOKEN_KEY } from "../local-storage";
import ProtectedRoute from "./protected-route";

describe("ProtectedRoute", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("redirects to unauthorized when the user token is missing", () => {
    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route path="/unauthorized" element={<div>Unauthorized</div>} />
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div>Protected</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Unauthorized")).toBeInTheDocument();
  });

  it("renders children when a user token exists", () => {
    setLocalStorage(USER_TOKEN_KEY, "test-token");

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div>Protected</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Protected")).toBeInTheDocument();
  });
});
