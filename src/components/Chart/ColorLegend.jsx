import { CardContent, Paper, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const ColorLegend = ({
  colorScale,
  tickSpacing = 2,
  tickSize = 15,
  onSelected,
  selectedPrimayData,
  selectedSecondaryData,
}) => (
  <Paper elevation={0}>
    <CardContent>
      <Typography gutterBottom variant="h5" component="div">
        Chart Legend
      </Typography>
      {colorScale.domain().length ? (
        colorScale.domain().map((domainValue, i) => {
          const isSelected =
            selectedPrimayData === domainValue ||
            selectedSecondaryData === domainValue;

          return (
            <Stack
              direction="row"
              alignItems="center"
              spacing={tickSpacing}
              key={i + domainValue}
              onClick={(e) => {
                onSelected(e, domainValue);
              }}
              sx={{
                cursor: "pointer",
              }}
            >
              <Box
                sx={{
                  backgroundColor: `${colorScale(domainValue)}`,
                  width: `${tickSize}px`,
                  height: `${tickSize}px`,
                  opacity: `${isSelected ? 1 : 0.3}`,
                }}
              />
              <Typography
                sx={{
                  fontSize: 22,
                  fontWeight: `${isSelected ? 600 : 400}`,
                }}
                color="text.secondary"
                gutterBottom
              >
                {domainValue}
              </Typography>
            </Stack>
          );
        })
      ) : (
        <Typography variant="h6" component="p">
          Chart is empty
        </Typography>
      )}
    </CardContent>
  </Paper>
);

export default ColorLegend;
