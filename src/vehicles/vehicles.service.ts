import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import {
  VehiclesTable,
  TIVehicle,
  TSVehicle,
  VehicleSpecificationsTable,
} from "../drizzle/schema";

interface VehicleSpecifications {
  color: string | null;
  engineCapacity: string | null;
  features: string | null;
  fuelType: string | null;
  seatingCapacity: number | null;
  manufacturer: string | null;
  model: string | null;
  transmission: string | null;
  year: number | null;
}

interface TVehicles {
  vehicleId: number;
  availability: boolean | null;
  rentalRate: string | null;
  specifications: VehicleSpecifications;
}

// service to fetch all vehicles
export const fetchAllVehiclesService = async (
  limit?: number
): Promise<TVehicles[]> => {
  const vehicles = await db.query.VehiclesTable.findMany({
    limit: limit || undefined,
    columns: {
      vehicleId: true,
      availability: true,
      rentalRate: true,
    },
    with: {
      specifications: {
        columns: {
          color: true,
          engineCapacity: true,
          features: true,
          fuelType: true,
          seatingCapacity: true,
          manufacturer: true,
          model: true,
          transmission: true,
          year: true,
        },
      },
    },
  });

  // ensure the return types matches the Vehicles interface
  return vehicles.map((vehicle) => ({
    vehicleId: vehicle.vehicleId,
    availability: vehicle.availability ?? false, // default to false if null
    rentalRate: vehicle.rentalRate ?? "", // default to empty string if null
    specifications: {
      color: vehicle.specifications?.color ?? null,
      engineCapacity: vehicle.specifications?.engineCapacity ?? null,
      features: vehicle.specifications?.features ?? null,
      fuelType: vehicle.specifications?.fuelType ?? null,
      seatingCapacity: vehicle.specifications?.seatingCapacity ?? null,
      manufacturer: vehicle.specifications?.manufacturer ?? null,
      model: vehicle.specifications?.model ?? null,
      transmission: vehicle.specifications?.transmission ?? null,
      year: vehicle.specifications?.year ?? null,
    },
  }));
};

interface VehicleSpecifications {
  color: string | null;
  engineCapacity: string | null;
  features: string | null;
  fuelType: string | null;
  seatingCapacity: number | null;
  manufacturer: string | null;
  model: string | null;
  transmission: string | null;
  year: number | null;
}

interface Vehicles {
  availability: boolean | null;
  rentalRate: string | null;
  specifications: VehicleSpecifications;
}

// service to fetch a single vehicle by id
export const getVehicleByIdService = async (
  id: number
): Promise<Vehicles | null> => {
  const result = await db.query.VehiclesTable.findFirst({
    columns: {
      availability: true,
      rentalRate: true,
    },
    where: eq(VehiclesTable.vehicleId, id),
    with: {
      specifications: {
        columns: {
          color: true,
          engineCapacity: true,
          features: true,
          fuelType: true,
          seatingCapacity: true,
          manufacturer: true,
          model: true,
          transmission: true,
          year: true,
        },
      },
    },
  });

  if (!result) {
    return null;
  }

  return {
    availability: result.availability ?? null,
    rentalRate: result.rentalRate ?? null,
    specifications: {
      color: result.specifications.color ?? null,
      engineCapacity: result.specifications.engineCapacity ?? null,
      features: result.specifications.features ?? null,
      fuelType: result.specifications.fuelType ?? null,
      seatingCapacity: result.specifications.seatingCapacity ?? null,
      manufacturer: result.specifications.manufacturer ?? null,
      model: result.specifications.model ?? null,
      transmission: result.specifications.transmission ?? null,
      year: result.specifications.year ?? null,
    },
  };
};

// service to create a new vehicle with specifications
export const createVehicleWithSpecificationsService = async (
  vehicleData: TIVehicle | any
) => {
  try {
    // insert vehicle specification data into vehicle specification table
    console.log(vehicleData);
    const createdVehicleSpec = await db
      .insert(VehicleSpecificationsTable)
      .values({
        manufacturer: vehicleData.manufacturer,
        model: vehicleData.model,
        year: vehicleData.year,
        fuelType: vehicleData.fuelType,
        engineCapacity: vehicleData.engineCapacity,
        transmission: vehicleData.transmission,
        seatingCapacity: vehicleData.seatingCapacity,
        color: vehicleData.color,
        features: vehicleData.features,
      })
      .returning();

    // extract the created vehicle specification id
    const vehicleSpecId = createdVehicleSpec[0].vehicleId;

    // insert vehicle data into vehicle table
    const createdVehicle = await db
      .insert(VehiclesTable)
      .values({
        vehicleSpecId,
        availability: vehicleData.availability,
        rentalRate: vehicleData.rentalRate,
      })
      .returning();

    // return the created vehicle id
    return {
      vehicleSpec: createdVehicleSpec[0],
      vehicle: createdVehicle[0],
    };
  } catch (error) {
    console.error("Error creating vehicle with specifications: ", error);
    throw new Error("Vehicle creation failed");
  }
};

// Service to update a vehicle by ID
export const updateVehicleService = async (
  id: number,
  vehicle: Partial<TIVehicle>
): Promise<string> => {
  await db
    .update(VehiclesTable)
    .set(vehicle)
    .where(eq(VehiclesTable.vehicleId, id));
  return "Vehicle updated successfully";
};

// Service to delete a vehicle by ID
export const deleteVehicleService = async (id: number): Promise<string> => {
  await db.delete(VehiclesTable).where(eq(VehiclesTable.vehicleId, id));
  return "Vehicle deleted successfully";
};
