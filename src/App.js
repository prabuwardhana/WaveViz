import {
  FileContentContextProvider,
  AxisSettingsContextProvider,
  SecondAxisContextProvider,
} from "./store/contexts";
import { LineChart, AxisSettings } from "./components";
import OpenFileButton from "./components/Buttons/OpenFileButton";
import "./App.css";
import { ButtonGroup, Stack } from "@mui/material";

function App() {
  return (
    <div className="App">
      <FileContentContextProvider>
        <AxisSettingsContextProvider>
          <SecondAxisContextProvider>
            <Stack spacing={5}>
              <LineChart />
              <ButtonGroup size="large" aria-label="large button group">
                <OpenFileButton />
                <AxisSettings />
              </ButtonGroup>
            </Stack>
          </SecondAxisContextProvider>
        </AxisSettingsContextProvider>
      </FileContentContextProvider>
    </div>
  );
}

export default App;
