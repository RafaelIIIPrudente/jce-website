import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

const FOREST = "#1F4D38";
const CREAM = "#FBFAF7";
const STEEL = "#5C6962";
const HAIRLINE = "#D8D4CC";

export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "JC Electrofields Power System";
  const eyebrow =
    searchParams.get("eyebrow") ?? "Power Systems EPC — Philippines";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: CREAM,
        padding: "72px",
        fontFamily: "sans-serif",
        color: FOREST,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 500,
            color: STEEL,
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            fontSize: 22,
            letterSpacing: "0.04em",
            fontWeight: 600,
            color: FOREST,
          }}
        >
          JC ELECTROFIELDS
        </div>
      </div>

      <div
        style={{
          display: "flex",
          fontSize: 86,
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          fontWeight: 500,
          color: FOREST,
          maxWidth: "90%",
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `1px solid ${HAIRLINE}`,
          paddingTop: "24px",
          fontSize: 20,
          color: STEEL,
        }}
      >
        <div>jcepower.com</div>
        <div>Since 1997 — Philippines</div>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
