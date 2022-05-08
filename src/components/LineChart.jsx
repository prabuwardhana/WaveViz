import React, { useContext, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { AxisBottom, AxisLeft, AxisRight, ColorLegend } from "./Chart";
import { Card, CardContent, Grid, Stack } from "@mui/material";
import { FileContentContext, SecondAxisContext } from "../store/stores";

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
  const [{ keys, showSecondAxis, checkedState }, dispatch] =
    useContext(SecondAxisContext);

  // Component states
  const [parsedData, setParsedData] = useState([]);
  const [primaryAxisData, setPrimaryAxisData] = useState([]);
  const [secondaryAxisData, setSecondaryAxisData] = useState([]);
  const [selectedPrimayData, setSelectedPrimaryData] = useState([]);
  const [selectedSecondaryData, setSelectedSecondaryData] = useState([]);
  const [currentZoomState, setCurrentZoomState] = useState(null);

  // DOM references
  const pathPrimaryRef = useRef();
  const pathSecondaryRef = useRef();
  const pathSelectedPrimaryRef = useRef();
  const pathSelectedSecondaryRef = useRef();
  const svgRef = useRef();

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

    // Create keys from each column's header, ignoring the first one.
    d.length &&
      dispatch({
        type: "SET_KEYS",
        payload: d.columns.slice(1),
      });

    return () => undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  // Modify our data structure.
  useEffect(() => {
    // console.log("Set Data Effect Runs");
    const columnValues = keys.map((item) => {
      return {
        id: item,
        values: parsedData.map((d) => {
          return { date: d.date, value: +d[item] };
        }),
      };
    });

    const secondaryData = columnValues.filter(
      (d, index) => checkedState[index]
    );

    if (secondaryData.length) {
      setSecondaryAxisData(secondaryData);
      setSelectedPrimaryData([]);
    } else {
      setSecondaryAxisData([]);
      setSelectedSecondaryData([]);
    }

    const primaryData = columnValues.filter((d) => !secondaryData.includes(d));
    setPrimaryAxisData(primaryData);

    // Select first column to be highlighted in the chart.
    primaryData.length && setSelectedPrimaryData(primaryData.slice(0, 1));
  }, [keys, parsedData, checkedState]);

  // Chart's constants
  const xValue = (d) => d.date;
  const yValue = (d) => d.value;

  // Scale the x-axis by scaling the domain (data range)
  // to the actual capacity range of the horizontal axis
  const getX = d3
    .scaleTime()
    .domain(d3.extent(parsedData, (d) => d.date))
    .range([0, innerWidth]);

  // Rescale x-axis when it's zoomed.
  if (currentZoomState) {
    const newXScale = currentZoomState
      .rescaleX(getX)
      .interpolate(d3.interpolateRound);
    getX.domain(newXScale.domain());
  }

  // Scale the y-axis by scaling the range between y-axis' min and max values
  // to the actual capacity range of the vertical axis
  const getY0 = d3.scaleLinear().domain([0, 10]).range([innerHeight, 0]);
  const getY1 = d3.scaleLinear().domain([0, 10]).range([innerHeight, 0]);

  // our color palette
  const color = d3.scaleOrdinal().domain(keys).range(d3.schemeSet1);

  // Draw the line-chart.
  // Run everytime the data is modified or transformed.
  // This effect runs a lot.
  useEffect(() => {
    // console.log("Draw Line Effect Runs");
    selectedPrimayData.length
      ? d3
          .select(pathSelectedPrimaryRef.current)
          .selectAll("path")
          .data(selectedPrimayData)
          .join("path")
          .attr("fill", "none")
          .attr("stroke-width", 1)
          .attr("stroke", (d) => color(d.id))
          .attr("d", (d) => {
            return d3
              .line()
              .x((d) => getX(xValue(d)))
              .y((d) => getY0(yValue(d)))
              .curve(d3.curveLinear)(d.values);
          })
      : d3.select(pathSelectedPrimaryRef.current).selectAll("path").remove();

    primaryAxisData.length &&
      d3
        .select(pathPrimaryRef.current)
        .selectAll("path")
        .data(primaryAxisData)
        .join("path")
        .attr("fill", "none")
        .attr("stroke-width", 1)
        .attr("stroke", (d) => color(d.id))
        .attr("opacity", 0.3)
        .attr("d", (d) => {
          return d3
            .line()
            .x((d) => getX(xValue(d)))
            .y((d) => getY0(yValue(d)))
            .curve(d3.curveLinear)(d.values);
        });

    selectedSecondaryData.length
      ? d3
          .select(pathSelectedSecondaryRef.current)
          .selectAll("path")
          .data(selectedSecondaryData)
          .join("path")
          .attr("fill", "none")
          .attr("stroke-width", 1)
          .attr("stroke", (d) => color(d.id))
          .attr("d", (d) => {
            return d3
              .line()
              .x((d) => getX(xValue(d)))
              .y((d) => getY1(yValue(d)))
              .curve(d3.curveLinear)(d.values);
          })
      : d3.select(pathSelectedSecondaryRef.current).selectAll("path").remove();

    secondaryAxisData.length
      ? d3
          .select(pathSecondaryRef.current)
          .selectAll("path")
          .data(secondaryAxisData)
          .join("path")
          .attr("fill", "none")
          .attr("stroke-width", 1)
          .attr("stroke", (d) => color(d.id))
          .attr("opacity", 0.3)
          .attr("d", (d) => {
            return d3
              .line()
              .x((d) => getX(xValue(d)))
              .y((d) => getY1(yValue(d)))
              .curve(d3.curveLinear)(d.values);
          })
      : d3.select(pathSecondaryRef.current).selectAll("path").remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    primaryAxisData,
    secondaryAxisData,
    selectedPrimayData,
    selectedSecondaryData,
    getX,
    getY0,
    getY1,
  ]);

  // Configure zoom event
  useEffect(() => {
    // console.log("Configure Zoom Effect Runs");
    const zoom = d3
      .zoom()
      // 1x to 35x zoom
      .scaleExtent([1, 35])
      // panning range
      .translateExtent([
        [0, 0],
        [width, height],
      ])
      .filter((e) => e.ctrlKey);

    zoom(d3.select(svgRef.current));

    zoom.on("zoom", (e) => {
      setCurrentZoomState(e.transform);
    });
  }, []);

  // Handle event when the user click the legend
  const handleLegendOnCLick = (_, domain) => {
    const selectedInPrimary = primaryAxisData.filter((d) => d.id === domain);
    const selectedInSecondary = secondaryAxisData.filter(
      (d) => d.id === domain
    );

    selectedInPrimary.length
      ? setSelectedPrimaryData(selectedInPrimary)
      : setSelectedPrimaryData([]);
    selectedInSecondary.length
      ? setSelectedSecondaryData(selectedInSecondary)
      : setSelectedSecondaryData([]);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={10}>
        <Card>
          <CardContent>
            <svg
              ref={svgRef}
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

                {showSecondAxis && (
                  <>
                    <AxisRight
                      yScale={getY1}
                      innerWidth={innerWidth}
                      tickOffset={10}
                    />
                    <text
                      className="axis-label"
                      textAnchor="middle"
                      transform={`translate(${innerWidth + yAxisLabelOffset},${
                        innerHeight / 2
                      }) rotate(90)`}
                    >
                      Secondary Axis
                    </text>
                  </>
                )}

                <defs>
                  <clipPath id="clip">
                    <rect x={0} y={0} width={innerWidth} height={innerHeight} />
                  </clipPath>
                </defs>

                <g ref={pathPrimaryRef} clipPath="url(#clip)"></g>
                <g ref={pathSecondaryRef} clipPath="url(#clip)"></g>
                <g ref={pathSelectedPrimaryRef} clipPath="url(#clip)"></g>
                <g ref={pathSelectedSecondaryRef} clipPath="url(#clip)"></g>
              </g>
            </svg>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={2}>
        <Stack spacing={2}>
          <ColorLegend
            tickSize={25}
            colorScale={color}
            onSelected={handleLegendOnCLick}
            selectedPrimayData={
              selectedPrimayData.length && selectedPrimayData[0].id
            }
            selectedSecondaryData={
              selectedSecondaryData.length && selectedSecondaryData[0].id
            }
          />
        </Stack>
      </Grid>
    </Grid>
  );
}

export default LineChart;
