import React from "react";

const AxisBottom = ({
  xScale,
  innerHeight,
  innerWidth,
  tickFormat,
  tickOffset = 3,
}) => (
  <>
    <g className="tick" transform={`translate(0,0)`}>
      <line y2={innerHeight} strokeWidth={0.5} />
    </g>
    {xScale.ticks().map((tickValue) => (
      <g
        className="tick"
        key={tickValue}
        transform={`translate(${xScale(tickValue)},0)`}
      >
        <line y2={innerHeight} strokeWidth={0.5} />
        <text
          style={{ textAnchor: "middle" }}
          dy=".71em"
          y={innerHeight + tickOffset}
        >
          {tickFormat(tickValue)}
        </text>
      </g>
    ))}
    <g className="tick" transform={`translate(${innerWidth},0)`}>
      <line y2={innerHeight} strokeWidth={0.5} />
    </g>
  </>
);

export default AxisBottom;
