import React, { useState, useEffect, useRef, useContext } from "react";
import TriggerButton from "./Buttons/TriggerButton";
import Modal from "./Modal/Modal";
import AxisSettingsForm from "./Form/AxisSettingsForm";
import { AxisSettingsContext } from "../store/stores";
import { Alert, Stack } from "@mui/material";
import { Check } from "@mui/icons-material";

const AxisSettings = () => {
  // Application state.
  const [state, dispatch] = useContext(AxisSettingsContext);

  // Component state.
  const [isShown, setIsShown] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // DOM references
  const closeBtnRef = useRef();
  const modalRef = useRef();
  const ref = useRef({ modalRef, closeBtnRef });

  const triggerText = "Axis Settings";

  // Updating the value will definitely update the global state, thus modify the chart.
  // But it won't be persisted, thus the values will be gone once we close the app.
  const handleInputTextChange = (e) => {
    dispatch({
      type: "UPDATE_FIELD",
      payload: {
        key: e.target.name,
        value: e.target.value,
      },
    });
  };

  // Persist the setting value into a setting file
  const handleSubmit = async (e) => {
    e.preventDefault(e);

    setIsSaved(false);

    // invoke save-settings event.
    // The main process will handle it and give a respond
    const respond = await window.electronApi.saveSettings(
      e.target.dateFormat.value,
      e.target.yMin.value,
      e.target.yMax.value,
      e.target.yLabel.value,
      e.target.xLabel.value,
      e.target.y1Min.value,
      e.target.y1Max.value,
      e.target.secondAxisLabel.value
    );

    respond && setIsSaved(true);

    respond &&
      dispatch({
        type: "SET_AXIS",
        payload: {
          dateFormat: respond.dateFormat,
          yMin: respond.yMin,
          yMax: respond.yMax,
          yLabel: respond.yLabel,
          xLabel: respond.xLabel,
          y1Min: respond.y1Min,
          y1Max: respond.y1Max,
          secondAxisLabel: respond.secondAxisLabel,
        },
      });
  };

  const showModal = () => {
    setIsShown(true);
  };

  const closeModal = () => {
    setIsShown(false);
  };

  const onKeyDown = (e) => {
    if (e.keyCode === 27) {
      closeModal();
    }
  };

  useEffect(() => {
    isShown && closeBtnRef.current.focus();
  }, [isShown]);

  useEffect(() => {
    let timer = setTimeout(() => isSaved && setIsSaved(false), 3000);
    return () => {
      clearTimeout(timer);
    };
  }, [isSaved]);

  useEffect(() => {
    window.electronApi.onReadSettings((_event, value) => {
      dispatch({
        type: "SET_AXIS",
        payload: {
          dateFormat: value.dateFormat,
          yMin: value.yMin,
          yMax: value.yMax,
          yLabel: value.yLabel,
          xLabel: value.xLabel,
          y1Min: value.y1Min,
          y1Max: value.y1Max,
          secondAxisLabel: value.secondAxisLabel,
        },
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <TriggerButton handleClick={showModal} triggerText={triggerText} />
      {isShown && (
        <Modal
          ref={ref}
          onSubmit={handleSubmit}
          onChange={handleInputTextChange}
          closeModal={closeModal}
          onKeyDown={onKeyDown}
          data={state}
        >
          {isSaved && (
            <Stack>
              <Alert icon={<Check fontSize="inherit" />} severity="success">
                Saved!
              </Alert>
            </Stack>
          )}
          <AxisSettingsForm
            onSubmit={handleSubmit}
            onChange={handleInputTextChange}
            data={state}
          />
        </Modal>
      )}
    </>
  );
};

export default AxisSettings;
