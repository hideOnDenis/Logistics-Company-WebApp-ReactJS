import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchShipments } from "../features/shipments/shipmentSlice";
import { fetchOffices } from "../features/offices/officeSlice";
import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Box,
} from "@mui/material";
import Title from "./Title";
import { Link as RouterLink } from "react-router-dom";

export default function Orders() {
  const dispatch = useDispatch();
  const { shipments, status } = useSelector((state) => state.shipments);
  const { offices } = useSelector((state) => state.offices);

  useEffect(() => {
    dispatch(fetchShipments());
    dispatch(fetchOffices());
  }, [dispatch]);

  // Check if shipments data is being loaded or if there is an error
  const isLoading = status === "loading";
  const hasShipments = shipments.length > 0;

  const getDestinationName = (destinationId) => {
    const office = offices.find((office) => office._id === destinationId);
    return office ? `Office: ${office.name}` : destinationId; // Return the destination ID (custom destination) if not found as an office
  };
  return (
    <React.Fragment>
      <Title>Recent Orders</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Sender</TableCell>
            <TableCell>Destination</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell align="center" colSpan={4}>
                Loading shipments...
              </TableCell>
            </TableRow>
          ) : hasShipments ? (
            shipments.map((shipment) => (
              <TableRow key={shipment._id}>
                <TableCell>{shipment._id}</TableCell>
                <TableCell>{shipment.createdBy?.email || "N/A"}</TableCell>
                <TableCell>
                  {getDestinationName(shipment.destination)}
                </TableCell>
                <TableCell>{shipment.status || "N/A"}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell align="center" colSpan={4}>
                No shipments available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Box sx={{ mt: 3 }}>
        <RouterLink
          to="/employee/shipments"
          style={{ textDecoration: "underline", color: "#2074d4" }}
        >
          See more orders
        </RouterLink>
      </Box>
    </React.Fragment>
  );
}
