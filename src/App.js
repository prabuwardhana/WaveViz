import {
  FileContentStore,
  AxisSettingsStore,
  DataHeaderStore,
} from "./store/contexts";
import { LineChart, AxisSettings } from "./components";
import OpenFileButton from "./components/Buttons/OpenFileButton";
import "./App.css";
import { ButtonGroup, Stack } from "@mui/material";

function App() {
  return (
    <div className="App">
      <FileContentStore>
        <AxisSettingsStore>
          <DataHeaderStore>
            <Stack spacing={5}>
              <LineChart />
              <ButtonGroup size="large" aria-label="large button group">
                <OpenFileButton />
                <AxisSettings />
              </ButtonGroup>
            </Stack>
          </DataHeaderStore>
        </AxisSettingsStore>
      </FileContentStore>
    </div>
  );
}

export default App;
