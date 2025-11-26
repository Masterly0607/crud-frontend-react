import { useEffect, useState } from "react";
import { useNavigate, useParams, Link as RouterLink } from "react-router-dom";
import api from "../api";

import {
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Stack,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";

export default function TaskForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    due_date: "",
    is_completed: false,
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (isEdit) {
      api
        .get(`/tasks/${id}`)
        .then((res) => {
          const t = res.data;
          setForm({
            title: t.title || "",
            description: t.description || "",
            due_date: t.due_date || "",
            is_completed: t.is_completed || false,
          });
        })
        .catch((err) => {
          console.error(err);
          setSnackbar({
            open: true,
            message: "Failed to load task",
            severity: "error",
          });
        });
    }
  }, [id, isEdit]);

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field) => (event) => {
    const value =
      field === "is_completed" ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setSnackbar({
        open: true,
        message: "Please fix the errors in the form",
        severity: "warning",
      });
      return;
    }

    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/tasks/${id}`, form);
      } else {
        await api.post("/tasks", form);
      }

      setSnackbar({
        open: true,
        message: isEdit ? "Task updated" : "Task created",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to save task",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  return (
    <>
      <Card sx={{ maxWidth: 600, margin: "0 auto" }}>
        <CardHeader
          title={isEdit ? "Edit Task" : "Create Task"}
          subheader={
            <Typography
              component={RouterLink}
              to="/"
              sx={{ textDecoration: "none" }}
            >
              ← Back to list
            </Typography>
          }
        />
        <CardContent>
          <form onSubmit={handleSubmit} noValidate>
            <Stack spacing={2}>
              <TextField
                label="Title"
                required
                fullWidth
                value={form.title}
                onChange={handleChange("title")}
                error={Boolean(errors.title)}
                helperText={errors.title}
              />

              <TextField
                label="Description"
                fullWidth
                multiline
                minRows={3}
                value={form.description}
                onChange={handleChange("description")}
              />

              <TextField
                label="Due Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={form.due_date || ""}
                onChange={handleChange("due_date")}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.is_completed}
                    onChange={handleChange("is_completed")}
                  />
                }
                label="Completed"
              />

              <Button type="submit" variant="contained" disabled={saving}>
                {saving ? "Saving..." : isEdit ? "Update Task" : "Create Task"}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
