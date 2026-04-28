import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { UserContext } from "../../../context/user-context";
import LocalLoginScreen from "./index";

vi.mock("../../../mutations/auth", () => ({
  useLogin: () => ({
    mutateAsync: vi.fn().mockResolvedValue("fake-token"),
    isPending: false,
  }),
}));

vi.mock("../../../queries/teams", () => ({
  getAllTeams: () => ({
    data: [{ id: "team-1", name: "Team 1" }],
    isLoading: false,
  }),
  getUsersOfTeam: () => ({ data: [], isLoading: false }),
}));

vi.mock("../../../hooks/use-track", () => ({
  useTrack: () => ({ trackEvent: vi.fn() }),
}));

describe("LocalLoginScreen", () => {
  it("renders the login button disabled before team/user selection", () => {
    render(
      <UserContext.Provider value={{ user: null, checkUser: vi.fn() } as any}>
        <MemoryRouter>
          <LocalLoginScreen />
        </MemoryRouter>
      </UserContext.Provider>,
    );

    const loginButton = screen.getByRole("button", { name: /התחבר|login/i });
    expect(loginButton).toBeVisible();
    expect(loginButton).toBeDisabled();
  });
});
