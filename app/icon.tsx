import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#1F4D38",
        color: "#FBFAF7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        fontWeight: 600,
        letterSpacing: "-0.02em",
        fontFamily: "sans-serif",
        borderRadius: 6,
      }}
    >
      J
    </div>,
    { ...size },
  );
}
