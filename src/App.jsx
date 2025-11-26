import { Routes, Route, Link as RouterLink } from "react-router-dom";
import { useMemo, useState } from "react";

import TaskList from "./pages/TaskList";
import TaskForm from "./pages/TaskForm";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

export default function App() {
  const [mode, setMode] = useState("light");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#2e7d32", // green
          },
        },
        shape: {
          borderRadius: 10,
        },
      }),
    [mode]
  );

  const toggleMode = () =>
    setMode((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            Task Manager
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <Button color="inherit" component={RouterLink} to="/">
              Tasks
            </Button>
            <Button
              color="inherit"
              variant="outlined"
              component={RouterLink}
              to="/create"
            >
              + New Task
            </Button>
            <Tooltip title={mode === "light" ? "Dark mode" : "Light mode"}>
              <IconButton color="inherit" onClick={toggleMode}>
                {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Container sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<TaskList />} />
            <Route path="/create" element={<TaskForm />} />
            <Route path="/edit/:id" element={<TaskForm />} />
          </Routes>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
