import {
  act,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react-native";
import React from "react";

import { useLoading } from "@/src/useHook/useLoading";

describe("useLoading", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("init render", () => {
    const { result } = renderHook(() =>
      useLoading({
        size: "medium",
      })
    );

    expect(result.current.open).toBeDefined();
    expect(result.current.close).toBeDefined();
    expect(result.current.LoadingComponent).toBeDefined();
  });

  it("open and close", async () => {
    const { result } = renderHook(() =>
      useLoading({
        size: "medium",
      })
    );

    act(() => {
      result.current.open();
    });

    render(<result.current.LoadingComponent />);

    await act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(screen.getByTestId("loadingLogo")).toBeTruthy();
    });

    act(() => {
      result.current.close();
    });

    render(<result.current.LoadingComponent />);

    await waitFor(() => {
      expect(screen.queryByTestId("loadingLogo")).toBeNull();
    });
  });

  test("open and auto close after 60000", async () => {
    const { result } = renderHook(() =>
      useLoading({
        size: "medium",
      })
    );

    act(() => {
      result.current.open();
    });

    render(<result.current.LoadingComponent />);

    // ép react re-render trước khi assert
    await act(() => {
      jest.runAllTimers();
    });

    await waitFor(
      () => {
        render(<result.current.LoadingComponent />);

        expect(screen.queryByTestId("loadingLogo")).toBeNull();
      },
      { timeout: 70000 }
    );
  });
});
