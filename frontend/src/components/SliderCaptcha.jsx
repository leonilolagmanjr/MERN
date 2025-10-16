import React, { useState, useEffect } from "react";
import { Slider, Box, Typography, Button } from "@mui/material";

export default function SliderCaptcha({ onPass }) {
  const [value, setValue] = useState(0);
  const [target, setTarget] = useState({ min: 0, max: 0 });
  const [verified, setVerified] = useState(false);
  const [msg, setMsg] = useState("");

  const randomize = () => {
    const start = Math.floor(Math.random() * 60) + 10;
    const width = 10 + Math.floor(Math.random() * 10);
    setTarget({ min: start, max: start + width });
    setValue(0);
    setVerified(false);
    setMsg("");
  };

  useEffect(() => { randomize(); }, []);

  const handleVerify = () => {
    if (value >= target.min && value <= target.max) {
      setVerified(true);
      setMsg("✅ Verified!");
      onPass && onPass();
    } else {
      setMsg("❌ Try again!");
      randomize();
    }
  };

  return (
    <Box sx={{ width: 300, textAlign: "center", p: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Drag the slider into the highlighted zone to verify
      </Typography>
      <Box sx={{ position: "relative", mb: 2 }}>
        <Box
          sx={{
            position: "absolute",
            left: `${target.min}%`,
            width: `${target.max - target.min}%`,
            height: 8,
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: verified ? "success.main" : "primary.light",
            borderRadius: 1,
            opacity: 0.5,
          }}
        />
        <Slider
          value={value}
          onChange={(e, val) => setValue(val)}
          min={0}
          max={100}
          sx={{ color: verified ? "success.main" : "primary.main", height: 8 }}
        />
      </Box>
      <Button
        variant="contained"
        color={verified ? "success" : "primary"}
        onClick={handleVerify}
      >
        {verified ? "Verified" : "Verify"}
      </Button>
      <Typography sx={{ mt: 1, color: verified ? "green" : "error.main" }}>
        {msg}
      </Typography>
    </Box>
  );
}
