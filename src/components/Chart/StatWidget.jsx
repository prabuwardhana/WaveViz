import { CardContent, Paper, Typography } from "@mui/material";
import React from "react";

const StatWidget = ({
  rangeMax = 0,
  rangeMin = 0,
  stdDev = 0,
  mean = 0,
  median = 0,
}) => (
  <Paper elevation={0}>
    <CardContent>
      <Typography gutterBottom variant="h5" component="div">
        Statistics
      </Typography>
      <Typography>Max: {rangeMax}</Typography>
      <Typography>Min: {rangeMin}</Typography>
      <Typography>Standard Deviation: {stdDev}</Typography>
      <Typography>Mean: {mean}</Typography>
      <Typography>Median: {median}</Typography>
    </CardContent>
  </Paper>
);

export default StatWidget;
