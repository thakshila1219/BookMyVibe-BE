import dotenv from "dotenv";
dotenv.config(); // අනිත් files import කරන්න කලින් මේක උඩින්ම තියෙන්න ඕනේ!

import app from "./app";
import DBConnection from "./db/DBConnection";

// Define the application port
const port = process.env.PORT || 3000

// Connect to the database
DBConnection().then(result => console.log(result))

// Instructs the express app to listen on port 3000
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})


