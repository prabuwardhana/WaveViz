import React, { useContext } from "react";
import SecondaryAxisCheckbox from "./SecondaryAxisCheckbox";
import { SecondAxisContext } from "../../store/contexts";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { Save } from "@mui/icons-material";

const AxisSettingsForm = ({ onSubmit, onChange, data }) => {
  const [{ keys }] = useContext(SecondAxisContext);
  return (
    <Box component="form" noValidate autoComplete="off" onSubmit={onSubmit}>
      <Typography gutterBottom variant="h6" component="div">
        General
      </Typography>
      <Stack spacing={3} mb={1}>
        <Stack>
          <TextField
            id="outlined-dateFormat"
            label="Date Format"
            name="dateFormat"
            value={data.dateFormat}
            onChange={onChange}
            helperText="(e.g. %Y-%m-%d, %Y/%m/%d, %Y%m%d)"
          />
        </Stack>
      </Stack>
      <Typography gutterBottom variant="h6" component="div">
        Primary Axes
      </Typography>
      <Stack spacing={3} mb={1}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          justifyContent="space-between"
        >
          <TextField
            id="outlined-yMin"
            label="Y-axis min"
            type="number"
            name="yMin"
            InputLabelProps={{
              shrink: true,
            }}
            value={data.yMin}
            onChange={onChange}
          />
          <TextField
            id="outlined-yMax"
            label="Y-axis max"
            type="number"
            name="yMax"
            InputLabelProps={{
              shrink: true,
            }}
            value={data.yMax}
            onChange={onChange}
          />
        </Stack>
        <Stack spacing={3}>
          <TextField
            id="outlined-yLabel"
            label="Y-axis label (Left)"
            name="yLabel"
            value={data.yLabel}
            onChange={onChange}
          />
          <TextField
            id="outlined-xLabel"
            label="X-axis label"
            name="xLabel"
            value={data.xLabel}
            onChange={onChange}
          />
        </Stack>
      </Stack>
      <Typography gutterBottom variant="h6" component="div">
        Secondary Vertical Axis
      </Typography>
      <Stack spacing={3} mb={1}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          justifyContent="space-between"
        >
          <TextField
            id="outlined-y1Min"
            label="Min"
            type="number"
            name="y1Min"
            InputLabelProps={{
              shrink: true,
            }}
            value={data.y1Min}
            onChange={onChange}
          />
          <TextField
            id="outlined-y1Max"
            label="Max"
            type="number"
            name="y1Max"
            InputLabelProps={{
              shrink: true,
            }}
            value={data.y1Max}
            onChange={onChange}
          />
        </Stack>
        <Stack spacing={2}>
          <TextField
            id="outlined-secondAxisLabel"
            label="Label"
            name="secondAxisLabel"
            value={data.secondAxisLabel}
            onChange={onChange}
          />
          <SecondaryAxisCheckbox
            keys={keys}
            data={data}
            name="secondary-axis"
            value="value"
            labelText="Show secondary axis"
          />
        </Stack>
      </Stack>
      <Stack direction="row" mt={4}>
        <Button type="submit" variant="contained" startIcon={<Save />}>
          Save Settings
        </Button>
      </Stack>
    </Box>
  );
};

export default AxisSettingsForm;
