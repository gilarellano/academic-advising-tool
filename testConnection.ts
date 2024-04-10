import { createConnection } from "typeorm";

createConnection()
  .then(async connection => {
    console.log("Successfully connected to the database.");

    // Perform a simple query - this is just an example, adjust as needed
    const result = await connection.query('SELECT version();');
    console.log(result);

    // Close the connection when done
    await connection.close();
  })
  .catch(error => {
    console.error("Error connecting to the database:", error);
  });

