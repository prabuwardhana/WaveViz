import React, { useContext, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  AxisBottom,
  AxisLeft,
  AxisRight,
  ColorLegend,
  StatWidget,
} from "./Chart";
import { Card, CardContent, Grid, Stack } from "@mui/material";
import {
  AxisSettingsContext,
  FileContentContext,
  SecondAxisContext,
} from "../store/contexts";

const width = 960;
const height = 380;
const margin = { top: 20, right: 90, bottom: 60, left: 40 };
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

var f = d3.format(".2f");

function LineChart() {
  // Global state
  const [{ content }] = useContext(FileContentContext);
  const [{ keys, showSecondAxis, checkedState }, dispatch] =
    useContext(SecondAxisContext);
  const [
    { dateFormat, yMin, yMax, yLabel, xLabel, y1Min, y1Max, secondAxisLabel },
  ] = useContext(AxisSettingsContext);

  // Component states
  const [parsedData, setParsedData] = useState([]);
  const [primaryAxisData, setPrimaryAxisData] = useState([]);
  const [secondaryAxisData, setSecondaryAxisData] = useState([]);
  const [selectedPrimayData, setSelectedPrimaryData] = useState([]);
  const [selectedSecondaryData, setSelectedSecondaryData] = useState([]);
  const [currentZoomState, setCurrentZoomState] = useState(null);
  const [brushExtent, setBrushExtent] = useState(null);
  const [maxValue, setMaxValue] = useState(0);
  const [minValue, setMinValue] = useState(0);
  const [stdDev, setStdDev] = useState(0);
  const [mean, setMean] = useState(0);
  const [median, setMedian] = useState(0);

  // DOM references
  const pathPrimaryRef = useRef();
  const pathSecondaryRef = useRef();
  const pathSelectedPrimaryRef = useRef();
  const pathSelectedSecondaryRef = useRef();
  const svgRef = useRef();
  const brushRef = useRef();
  const tooltipFocusRef = useRef();
  const focusCircleRef = useRef();
  const focusLineXRef = useRef();
  const focusLineYRef = useRef();
  const textY1Ref = useRef();
  const textY2Ref = useRef();

  const innerWidthOffset = showSecondAxis ? 50 : 0;

  // Parse loaded csv data.
  useEffect(() => {
    // console.log("Parsing Effect Runs");
    let d = d3.csvParse(content);
    const parseDate = d3.timeParse(dateFormat.trim());
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
  }, [content, dateFormat]);

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
  const getY0 = d3.scaleLinear().domain([yMin, yMax]).range([innerHeight, 0]);
  const getY1 = d3.scaleLinear().domain([y1Min, y1Max]).range([innerHeight, 0]);

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

  // Configure brush event
  // This effect also runs a lot.
  useEffect(() => {
    // console.log("Configure Brush Effect Runs");
    const brush = d3.brushX().extent([
      [0, 0],
      [innerWidth, innerHeight],
    ]);

    brush(d3.select(brushRef.current));

    brush.on("brush end", (e) => {
      setBrushExtent(e.selection && e.selection.map(getX.invert));
    });
  }, [getX]);

  // Filter out data outside the brush
  // This effect runs a lot, too.
  useEffect(() => {
    // console.log("Filter data Effect Runs");
    const dt = selectedPrimayData.length
      ? selectedPrimayData
      : selectedSecondaryData;

    dt.forEach(({ id, values }) => {
      let filteredData = [];
      filteredData[id] = brushExtent
        ? values.filter((d) => {
            const date = xValue(d);
            return date > brushExtent[0] && date < brushExtent[1];
          })
        : values;

      setMaxValue(d3.max(filteredData[id], (t) => t.value));
      setMinValue(d3.min(filteredData[id], (t) => t.value));
      setStdDev(f(d3.deviation(filteredData[id], (t) => t.value)));
      setMean(f(d3.mean(filteredData[id], (t) => t.value)));
      setMedian(d3.median(filteredData[id], (t) => t.value));
    });
  }, [brushExtent, selectedPrimayData, selectedSecondaryData]);

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

  const handleTooltipOnMouseMove = (e) => {
    const dt = selectedPrimayData.length
      ? selectedPrimayData
      : selectedSecondaryData;

    dt.forEach(({ id, values }) => {
      let bisect = [];
      bisect[id] = d3.bisector((d) => d.date).left;

      const x0 = getX.invert(d3.pointer(e, this)[0]);
      const i = bisect[id](values, x0, 1);
      const d0 = values[i - 1];
      const d1 = values[i];
      const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
      const y = selectedPrimayData.length ? getY0(d.value) : getY1(d.value);
      const x = getX(d.date);

      const formatDate = d3.timeFormat("%B %A %-d, %Y");

      d3.select(focusCircleRef.current).attr(
        "transform",
        `translate(${x},${y})`
      );

      d3.select(textY1Ref.current)
        .attr("transform", `translate(${x},${y})`)
        .text(d.value);

      d3.select(textY2Ref.current)
        .attr("transform", `translate(${x},${y})`)
        .text(formatDate(d.date));

      d3.select(focusLineXRef.current)
        .attr("transform", `translate(${x},${y})`)
        .attr("y2", innerHeight - y);

      d3.select(focusLineYRef.current).attr("transform", `translate(0,${y})`);
    });
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <svg
              ref={svgRef}
              viewBox={`0 0 ${
                innerWidth + margin.left + margin.right + innerWidthOffset
              } 
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
                  {xLabel}
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
                  {yLabel}
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
                      {secondAxisLabel}
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
                <g
                  ref={tooltipFocusRef}
                  className="focus"
                  style={{ display: "none" }}
                  clipPath="url(#clip)"
                >
                  <line
                    ref={focusLineXRef}
                    className="x"
                    y1={0}
                    y2={innerHeight}
                    style={{ strokeDasharray: "2", opacity: "0.5" }}
                    strokeWidth={0.5}
                  />
                  <line
                    ref={focusLineYRef}
                    className="y"
                    x1={0}
                    x2={innerWidth}
                    style={{ strokeDasharray: "2", opacity: "0.5" }}
                    strokeWidth={0.5}
                  />
                  <circle
                    ref={focusCircleRef}
                    className="y"
                    r={2}
                    style={{ fill: "none" }}
                  />
                  <text
                    ref={textY1Ref}
                    className="tooltip-text"
                    dx="8"
                    dy="-.3em"
                  />
                  <text
                    ref={textY2Ref}
                    className="tooltip-text"
                    dx="8"
                    dy="1em"
                  />
                </g>
                <g
                  ref={brushRef}
                  className="brush"
                  onMouseOver={() =>
                    d3.select(tooltipFocusRef.current).style("display", null)
                  }
                  onMouseLeave={() =>
                    d3.select(tooltipFocusRef.current).style("display", "none")
                  }
                  onMouseMove={handleTooltipOnMouseMove}
                />
              </g>
            </svg>
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
              <StatWidget
                rangeMax={maxValue}
                rangeMin={minValue}
                stdDev={stdDev}
                mean={mean}
                median={median}
              />
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default LineChart;
