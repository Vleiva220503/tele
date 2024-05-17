import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";
import { InputAdornment } from "@mui/material";
import { Person, Wifi, Shield, Waves } from "@mui/icons-material";

// Registrar los componentes necesarios para Chart.js
ChartJS.register(
  LineElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  PointElement
);

function App() {
  const [datos, setDatos] = useState({
    numeroUsuarios: "",
    anchoBandaCanal: "",
    anchoBandaGuarda: "",
    frecuenciaCentralCanal1: "",
  });
  const [errors, setErrors] = useState({});
  const [resultados, setResultados] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validar que solo se acepten números enteros
    if (/^\d*$/.test(value)) {
      setDatos({
        ...datos,
        [name]: value,
      });
    }
  };

  const validate = () => {
    let tempErrors = {};
    if (
      !datos.numeroUsuarios ||
      datos.numeroUsuarios <= 0 ||
      datos.numeroUsuarios > 50
    ) {
      tempErrors.numeroUsuarios =
        "Número de usuarios debe ser mayor que 0 y menor o igual a 50";
    }
    if (!datos.anchoBandaCanal || datos.anchoBandaCanal <= 0) {
      tempErrors.anchoBandaCanal =
        "Ancho de banda por canal debe ser mayor que 0";
    }
    if (!datos.anchoBandaGuarda || datos.anchoBandaGuarda < 0) {
      tempErrors.anchoBandaGuarda =
        "Ancho de banda de guarda no puede ser negativo";
    }
    if (!datos.frecuenciaCentralCanal1 || datos.frecuenciaCentralCanal1 <= 0) {
      tempErrors.frecuenciaCentralCanal1 =
        "Frecuencia central del canal 1 debe ser mayor que 0 ";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const numeroUsuarios = parseInt(datos.numeroUsuarios);
    const anchoBandaCanal = parseFloat(datos.anchoBandaCanal);
    const anchoBandaGuarda = parseFloat(datos.anchoBandaGuarda);
    const frecuenciaCentralCanal1 = parseFloat(datos.frecuenciaCentralCanal1);

    // Calcular frecuencias portadoras
    const frecuencias = [];
    for (let i = 1; i <= numeroUsuarios; i++) {
      frecuencias.push(
        frecuenciaCentralCanal1 +
          ((i - 1) * (anchoBandaCanal + anchoBandaGuarda)) / 1000
      );
    }

    // Calcular ancho de banda total
    const anchoBandaTotal =
      (anchoBandaCanal + anchoBandaGuarda) * numeroUsuarios - anchoBandaGuarda;
    // Calcular tasa total de Kbps
    const tasaKbpsTotal = numeroUsuarios * 100;
    // Calcular tasa de Kbps sin bandas de guarda
    const tasaKbpsTotalSinGuarda = numeroUsuarios * anchoBandaCanal * 2;

    setResultados({
      numeroUsuarios,
      anchoBandaCanal,
      anchoBandaGuarda,
      frecuenciaCentralCanal1,
      frecuencias,
      anchoBandaTotal,
      tasaKbpsTotal,
      tasaKbpsTotalSinGuarda,
    });

    // Limpiar el formulario
    setDatos({
      numeroUsuarios: "",
      anchoBandaCanal: "",
      anchoBandaGuarda: "",
      frecuenciaCentralCanal1: "",
    });
    setErrors({});
  };

  return (
    <Container
      maxWidth="md"
      sx={{ backgroundColor: "#f0f4f8", p: 3, borderRadius: 2 }}
    >
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{ mt: 4, mb: 4, color: "primary.main" }}
      >
        Multiplexación por División en Frecuencia
      </Typography>
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardHeader
                title="Ingrese los datos"
                sx={{ backgroundColor: "secondary.main", color: "white" }}
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Número de usuarios"
                      name="numeroUsuarios"
                      type="number"
                      value={datos.numeroUsuarios}
                      onChange={handleChange}
                      error={!!errors.numeroUsuarios}
                      helperText={errors.numeroUsuarios}
                      variant="outlined"
                      color="primary"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Ancho de banda por canal (kHz)"
                      name="anchoBandaCanal"
                      type="number"
                      value={datos.anchoBandaCanal}
                      onChange={handleChange}
                      error={!!errors.anchoBandaCanal}
                      helperText={errors.anchoBandaCanal}
                      variant="outlined"
                      color="primary"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Wifi />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Ancho de banda de guarda (kHz)"
                      name="anchoBandaGuarda"
                      type="number"
                      value={datos.anchoBandaGuarda}
                      onChange={handleChange}
                      error={!!errors.anchoBandaGuarda}
                      helperText={errors.anchoBandaGuarda}
                      variant="outlined"
                      color="primary"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Shield />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Frecuencia central del canal 1 (MHz)"
                      name="frecuenciaCentralCanal1"
                      type="number"
                      value={datos.frecuenciaCentralCanal1}
                      onChange={handleChange}
                      error={!!errors.frecuenciaCentralCanal1}
                      helperText={errors.frecuenciaCentralCanal1}
                      variant="outlined"
                      color="primary"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Waves />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleSubmit}
                      sx={{ py: 2, fontSize: 16 }}
                    >
                      Calcular
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {resultados && (
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{ mb: 4, color: "primary.main" }}
          >
            Resultados
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardHeader
                  title="Detalles de Banda"
                  sx={{ backgroundColor: "secondary.main", color: "white" }}
                />
                <CardContent>
                  <Typography>
                    <strong>Número de usuarios:</strong>{" "}
                    {resultados.numeroUsuarios}
                  </Typography>
                  <Typography>
                    <strong>Ancho de banda por canal:</strong>{" "}
                    {resultados.anchoBandaCanal} kHz
                  </Typography>
                  <Typography>
                    <strong>Ancho de banda de guarda:</strong>{" "}
                    {resultados.anchoBandaGuarda} kHz
                  </Typography>
                  <Typography>
                    <strong>Frecuencia central del canal 1:</strong>{" "}
                    {resultados.frecuenciaCentralCanal1} MHz
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardHeader
                  title="Tasas de Transmisión"
                  sx={{ backgroundColor: "secondary.main", color: "white" }}
                />
                <CardContent>
                  <Typography>
                    <strong>Ancho de banda total:</strong>{" "}
                    {resultados.anchoBandaTotal.toFixed(2)} kHz
                  </Typography>
                  <Typography>
                    <strong>Número total de Kbps que se transmiten:</strong>{" "}
                    {resultados.tasaKbpsTotal.toFixed(2)} kbps
                  </Typography>
                  <Typography>
                    <strong>
                      Número total de Kbps que podrían transmitirse utilizando
                      todo el ancho de banda:
                    </strong>{" "}
                    {resultados.tasaKbpsTotalSinGuarda.toFixed(2)} kbps
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "primary.main" }}>
                <TableRow>
                  <TableCell sx={{ color: "white" }}>Usuario</TableCell>
                  <TableCell sx={{ color: "white" }}>
                    Frecuencia Portadora (MHz)
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>
                    Ancho de Banda del Canal (kHz)
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>
                    Ancho de Banda de Guarda (kHz)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resultados.frecuencias.map((freq, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:nth-of-type(odd)": { backgroundColor: "action.hover" },
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{freq.toFixed(6)}</TableCell>
                    <TableCell>{resultados.anchoBandaCanal}</TableCell>
                    <TableCell>{resultados.anchoBandaGuarda}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <div style={{ marginTop: "20px" }}>
            <Line
              data={{
                labels: resultados.frecuencias.map(
                  (_, index) => `Usuario ${index + 1}`
                ),
                datasets: [
                  {
                    label: "Frecuencia Portadora (MHz)",
                    data: resultados.frecuencias,
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
                    fill: false,
                  },
                ],
              }}
              options={{
                responsive: true,
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Usuarios",
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: "Frecuencia Portadora (MHz)",
                    },
                  },
                },
              }}
            />
          </div>
        </Paper>
      )}
    </Container>
  );
}

export default App;
