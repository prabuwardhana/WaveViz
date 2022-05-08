import React from "react";

const AxisRight = ({ yScale, innerWidth, tickOffset = 3 }) =>
  yScale.ticks().map((tickValue) => (
    <g
      key={tickValue}
      className="tick"
      transform={`translate(${innerWidth},${yScale(tickValue)})`}
    >
      <line x2={-innerWidth} strokeWidth={0.5} />
      <text style={{ textAnchor: "start" }} x={tickOffset} dy=".32em">
        {tickValue}
      </text>
    </g>
  ));

export default AxisRight;
