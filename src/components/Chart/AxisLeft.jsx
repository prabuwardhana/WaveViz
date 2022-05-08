import React from "react";

const AxisLeft = ({ yScale, innerWidth, tickOffset = 3 }) =>
  yScale.ticks().map((tickValue) => (
    <g
      key={tickValue}
      className="tick"
      transform={`translate(0,${yScale(tickValue)})`}
    >
      <line x2={innerWidth} strokeWidth={0.5} />
      <text style={{ textAnchor: "end" }} x={-tickOffset} dy=".32em">
        {tickValue}
      </text>
    </g>
  ));

export default AxisLeft;
