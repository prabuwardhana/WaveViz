import React, { useContext, useEffect, useState } from "react";
import * as d3 from "d3";
import { AxisBottom, AxisLeft } from "./Chart";
import { Card, CardContent, Grid } from "@mui/material";
import { FileContentContext } from "../store/stores";

const width = 960;
const height = 380;
const margin = { top: 40, right: 90, bottom: 80, left: 40 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
const xAxisLabelOffset = 55;
const yAxisLabelOffset = 55;

// Define our multiple time format.
const formatMillisecond = d3.timeFormat(".%L"),
  formatSecond = d3.timeFormat(":%S"),
  formatMinute = d3.timeFormat("%I:%M"),
  formatHour = d3.timeFormat("%I %p"),
  formatDay = d3.timeFormat("%a %d"),
  formatWeek = d3.timeFormat("%b %d"),
  formatMonth = d3.timeFormat("%b"),
  formatYear = d3.timeFormat("%Y");

const xAxisTickFormat = (date) => {
  return (
    d3.timeSecond(date) < date
      ? formatMillisecond
      : d3.timeMinute(date) < date
      ? formatSecond
      : d3.timeHour(date) < date
      ? formatMinute
      : d3.timeDay(date) < date
      ? formatHour
      : d3.timeMonth(date) < date
      ? d3.timeWeek(date) < date
        ? formatDay
        : formatWeek
      : d3.timeYear(date) < date
      ? formatMonth
      : formatYear
  )(date);
};

function LineChart() {
  // Global state
  const [{ content }] = useContext(FileContentContext);

  // Component states
  const [parsedData, setParsedData] = useState([]);

  // Parse loaded csv data.
  useEffect(() => {
    // console.log("Parsing Effect Runs");
    let d = d3.csvParse(content);
    const parseDate = d3.timeParse("%Y%m%d");
    d.forEach((row) => {
      row.date = parseDate(row.date);
    });

    // Set our parsed data.
    setParsedData(d);

    return () => undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  // Scale the x-axis by scaling the domain (data range)
  // to the actual capacity range of the horizontal axis
  const getX = d3
    .scaleTime()
    .domain(d3.extent(parsedData, (d) => d.date))
    .range([0, innerWidth]);

  // Scale the y-axis by scaling the range between y-axis' min and max values
  // to the actual capacity range of the vertical axis
  const getY0 = d3.scaleLinear().domain([0, 10]).range([innerHeight, 0]);

  return (
    <Grid container spacing={2}>
      <Card>
        <CardContent>
          <svg
            viewBox={`0 0 ${innerWidth + margin.left + margin.right} 
            ${innerHeight + margin.top + margin.bottom}`}
          >
            <g transform={`translate(${margin.right},${margin.top})`}>
              <AxisBottom
                xScale={getX}
                innerHeight={innerHeight}
                innerWidth={innerWidth}
                tickFormat={xAxisTickFormat}
                tickOffset={10}
              />
              <text
                className="axis-label"
                x={innerWidth / 2}
                y={innerHeight + xAxisLabelOffset}
                textAnchor="middle"
              >
                X Axis
              </text>
              <AxisLeft
                yScale={getY0}
                innerWidth={innerWidth}
                tickOffset={10}
              />
              <text
                className="axis-label"
                textAnchor="middle"
                transform={`translate(${-yAxisLabelOffset},${
                  innerHeight / 2
                }) rotate(-90)`}
              >
                Y Axis
              </text>

              <defs>
                <clipPath id="clip">
                  <rect x={0} y={0} width={innerWidth} height={innerHeight} />
                </clipPath>
              </defs>
            </g>
          </svg>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default LineChart;
