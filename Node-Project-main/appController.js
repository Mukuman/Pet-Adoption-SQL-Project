const express = require('express');
const appService = require('./appService');
console.log(appService)

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.

router.post("/reset-database", async (req, res) => {
    const initiateResult = await appService.resetDemotable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/high-donation-cities', async (req, res) => {
    const citiesTable = await appService.findCitiesWithHighDonations();
    if (citiesTable != null) {
        res.json({ 
            success: true,  
            data: citiesTable.rows
        });
    } else {
        res.status(500).json({ 
            success: false
        });
    }
});

router.get('/findPetsThatPlayAllGamesDivision', async(req, res) => {
    try {
        const pets = await appService.findPetsThatPlayAllGamesDivision();

            if (pets.length > 0) {
                res.json({ success: true, pets });
            } else {
                res.status(404).json({ success: false, message: "No pets found that play all games." });
            }
        } catch (error) {
            console.error("Error fetching pets:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
});

router.post('/findBreedsSelection', async (req, res) => {
    const {conditions} = req.body;

    if (!Array.isArray(conditions) || conditions.length === 0) {
        return res.status(400).json({ success: false, message: "A field is required." });
    }
    
    try {
        const tableValues = await appService.findBreedsSelection(conditions);
        if (tableValues.length > 0) {
            res.json({ success: true, tableValues });
        } else {
            res.status(404).json({ success: false, message: "No pets found of this breed." });
        }
    } catch (error) {
        console.error("Error fetching pets:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }

});

router.get('/findNumberPetsOfBreedHaving3', async (req, res) => {
    try {
        const pets = await appService.findNumberPetsOfBreedHaving3();
        if (pets.length > 0) {
            res.json({ success: true, pets});
        } else {
            res.status(404).json({ success: false, message: "No breeds have at least 3 pets." });
        }
    } catch (error) {
        console.error("Error fetching pets:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});


router.post("/book-appointment", async (req, res) => {
    const { date, time, adopterId, petId } = req.body;
    const insertResult = await appService.insertAppointmentTable(date, time, adopterId, petId);
    if (insertResult.success) {
        res.json({ success: true });
        console.log("Data sent to frontend.");
    } else {
        res.status(400).json({ success: false, error: insertResult.error });
    }
});

router.get('/get-adopters', async (req, res) => {
    const result = await appService.getAllAdopters();
    if (result.success) {
        res.json(result);
    } else {
        res.status(500).json({ success: false });
    }
});

router.post('/update-adopter', async (req, res) => {
    const { adopterId, field, value } = req.body;
    const result = await appService.updateAdopter(adopterId, field, value);
        
    if (result.success) {
        res.json({ success: true });
    } else {
        res.status(500).json({
            success: false,
            error: result.error
        });
    }
});


router.get('/getPetCountByBreed', async (req, res) => {
    console.log("Received request for Pet Count by Breed.");  // Log to confirm request received

    try {
        const result = await appService.getPetCountByBreed();  // Calls the function in appService.js
        console.log("Query 7 executed successfully. Data sent to frontend.");
        res.json({ success: true, data: result.rows });  // Send the result to the frontend
    } catch (err) {
        console.error("Error executing Query 7:", err);
        res.status(500).send("An error occurred while retrieving pet count by breed.");
    }
});

router.post('/delete-pet', async (req, res) => {
    const { petID } = req.body;

    //console.log("Received request for Delete.")
    const deleteResult = await appService.deletePetById(petID);
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post('/getProjection', async (req, res) => {
    const { attributes } = req.body;

    if (!attributes || attributes.length === 0) {
        return res.status(400).json({ success: false, message: "No attributes provided." });
    }

    try {
        const result = await appService.getProjection(attributes);
        res.json({ success: true, data: result.data });
    } catch (err) {
        console.error("Error executing projection query:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get('/getPetsByBreed', async (req, res) => {
    console.log("Received request for Pets By Breed.");  // Log to confirm request received

    try {
        const breedName = req.query.breedName;  // Extract breed name from the URL query parameters
        const result = await appService.getPetsByBreed(breedName);

        console.log("Join query executed successfully.");
        console.log("Data sent to frontend:", JSON.stringify(result, null, 2));  // Debugging log

        // Send the result in the expected format
        res.json({ success: true, data: result.data });  //Correctly send the data to frontend
    } catch (err) {
        console.error("Error executing Join query:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});


module.exports = router;