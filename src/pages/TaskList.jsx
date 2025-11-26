import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import api from "../api";

import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Stack,
  Typography,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  Skeleton,
  Box,
} from "@mui/material";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to load tasks",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openDeleteDialog = (task) => {
    setDeleteTarget(task);
  };

  const closeDeleteDialog = () => {
    setDeleteTarget(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/tasks/${deleteTarget.id}`);
      setTasks((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      setSnackbar({
        open: true,
        message: "Task deleted",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to delete task",
        severity: "error",
      });
    } finally {
      closeDeleteDialog();
    }
  };

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  const visibleTasks =
    rowsPerPage > 0
      ? tasks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : tasks;

  return (
    <>
      <Card>
        <CardHeader
          title="Tasks"
          action={
            <Button variant="contained" component={RouterLink} to="/create">
              + New Task
            </Button>
          }
        />
        <CardContent>
          {loading ? (
            <Box>
              {[...Array(4)].map((_, i) => (
                <Box key={i} sx={{ mb: 2 }}>
                  <Skeleton variant="rectangular" height={40} />
                </Box>
              ))}
            </Box>
          ) : tasks.length === 0 ? (
            <Typography color="text.secondary">
              No tasks yet. Create one!
            </Typography>
          ) : (
            <>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleTasks.map((task) => (
                    <TableRow key={task.id} hover>
                      <TableCell>{task.title}</TableCell>

                      {/* Description column */}
                      <TableCell>
                        {task.description ? (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                            title={task.description} // full text on hover
                          >
                            {task.description}
                          </Typography>
                        ) : (
                          "—"
                        )}
                      </TableCell>

                      <TableCell>
                        {task.due_date
                          ? new Date(task.due_date).toLocaleDateString()
                          : "—"}
                      </TableCell>

                      <TableCell>
                        {task.is_completed ? (
                          <Chip
                            label="Done"
                            color="success"
                            size="small"
                            variant="outlined"
                          />
                        ) : (
                          <Chip
                            label="Pending"
                            color="warning"
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </TableCell>

                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          <Button
                            size="small"
                            component={RouterLink}
                            to={`/edit/${task.id}`}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => openDeleteDialog(task)}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <TablePagination
                component="div"
                count={tasks.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <Dialog open={Boolean(deleteTarget)} onClose={closeDeleteDialog}>
        <DialogTitle>Delete task?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            <strong>{deleteTarget?.title}</strong>? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar notifications */}
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
