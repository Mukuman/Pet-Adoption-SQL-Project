const oracledb = require('oracledb');
const loadEnvFile = require('../CPSC304_Node_Project-main/utils/envUtil');
const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool 
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.

async function findCitiesWithHighDonations() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT A.city, ROUND(AVG(D.Amount), 2) as avg_donation
             FROM Donation D
             JOIN Adopter A ON A.AdopterID = D.AdopterID
             GROUP BY A.city
             HAVING AVG(D.Amount) > (
                 SELECT AVG(D2.Amount)
                 FROM Donation D2
             )
             ORDER BY avg_donation DESC`,
             [], 
             { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        return result;
    }).catch(() => {
        return null;
    });
}

async function insertAppointmentTable(date, time, adopterId, petId) {
    return await withOracleDB(async (connection) => {
        // First, check if the adopter exists
        const adopterCheck = await connection.execute(
            `SELECT 1 FROM Adopter WHERE AdopterID = :adopterId`,
            [adopterId]
        );

        if (adopterCheck.rows.length === 0) {
            return { success: false, error: 'ADOPTER_NOT_FOUND' };
        }

        // Then, check if the pet exists
        const petCheck = await connection.execute(
            `SELECT 1 FROM Pet WHERE PetID = :petId`,
            [petId]
        );

        if (petCheck.rows.length === 0) {
            return { success: false, error: 'PET_NOT_FOUND' };
        }

        // If both exist, proceed with the insertion
        const result = await connection.execute(
            `INSERT INTO Book_Appointment (AppointmentDate, AppointmentTime, AdopterID, PetID) 
             VALUES (TO_DATE(:appointmentDate, 'YYYY-MM-DD'), TO_TIMESTAMP(:appointmentTime, 'HH24:MI'), :adopterId, :petId)`,
            [date, time, adopterId, petId],
            { autoCommit: true }
        );

        return { success: result.rowsAffected && result.rowsAffected > 0};
    }).catch(() => {
        return false;
    });
}

async function getAllAdopters() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT * FROM Adopter ORDER BY AdopterID`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return { success: true, data: result.rows };
    }).catch(() => {
        return { success: false };
    });
}

async function updateAdopter(adopterId, field, value) {
    return await withOracleDB(async (connection) => {
        // First validate the adopter exists
        // SANITIZATION
        if (!isOneWord(adopterId)) {
            console.error("Only enter one word per category!");
            return [];
        }
        if (!isOneWord(value)) {
            console.error("Only enter one word per category!");
            return [];
        }

        const adopterCheck = await connection.execute(
            `SELECT 1 FROM Adopter WHERE AdopterID = :adopterId`,
            [adopterId]
        );

        if (adopterCheck.rows.length === 0) {
            return { success: false, error: 'ADOPTER_NOT_FOUND' };
        }

        // Perform the update
        const result = await connection.execute(
            `UPDATE Adopter SET ${field} = :value WHERE AdopterID = :adopterId`,
            [value, adopterId],
            { autoCommit: true }
        );
    
        return { 
            success: result.rowsAffected > 0,
            rowsAffected: result.rowsAffected
        };
    }).catch((error) => {
        
        // Check for unique constraint violation (email)
        if (error.errorNum === 1) { // ORA-00001: unique constraint violated
            return { success: false, error: 'UNIQUE_VIOLATION' };
        }
        
        return { success: false, error: 'DATABASE_ERROR' };
    });
}

async function findPetsThatPlayAllGamesDivision() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT p.PetName, p.PetID FROM Pet p WHERE NOT EXISTS 
                (SELECT g.GameID FROM Game g WHERE NOT EXISTS 
                    (SELECT 1 FROM Plays pl WHERE pl.GameID = g.GameID AND pl.PetID = p.PetID))`);

        return result.rows;
    }).catch((error) => {    
        console.error("Error fetching pets that play all games:", error);
        return [];
    });
}


async function findBreedsSelection(conditions) {
    // have to change to add inputs 

    return await withOracleDB(async (connection) => {
        if (conditions.length === 0) return [];

        let query = "SELECT * FROM Breed WHERE ";
        let params = {};
        let whereClauses = [];

        conditions.forEach((cond, index) => {
            whereClauses.push(`${cond.attribute} = :param${index}`);
            params[`param${index}`] = cond.value;
            if (index > 0) whereClauses[index] = `${cond.logic} ${whereClauses[index]}`;
        });

        query += whereClauses.join(" ");

        try {
            const result = await connection.execute(query, params);
            return result.rows;
        } catch (error) {
            console.error("Error fetching breeds:", error);
            return [];
        }
    });
}

async function findNumberPetsOfBreedHaving3() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT b.BreedName, COUNT(b.PetID) AS PetCount FROM Is_Breed b GROUP BY b.BreedName HAVING COUNT(b.PetID) > 2`);
        return result.rows;
    }).catch(() => {
        console.error("Error fetching pets with greater than 3 of breeds:");
        return [];
    });
}

async function getPetCountByBreed() {
    return await withOracleDB(async (connection) => {
        const query = `
            SELECT B.BreedName, COUNT(B.PetID) AS PetCount
            FROM Is_Breed B
            GROUP BY B.BreedName
        `;
        
        const result = await connection.execute(query, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        return result;
    });
}

async function deletePetById(petID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM Pet WHERE PetID = :petID`,
            [petID],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function getProjection(attributes) {
    return await withOracleDB(async (connection) => {
        const selectedAttributes = attributes.join(", ");
        const query = `SELECT ${selectedAttributes} FROM Pet`;
        
        const result = await connection.execute(query, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        if (!result || !result.rows) {
            return { success: false, message: "No data returned from the query." };
        }

        return { success: true, data: result.rows };
    }).catch(err => {
        console.error("Error fetching projection data:", err);
        return { success: false, error: err.message };
    });
}

async function getPetsByBreed(breedName) {
    return await withOracleDB(async (connection) => {
        if (!isOneWord(breedName)) {
            console.error("Only enter one word, no spaces!");
            return [];
        }
        const query = `
            SELECT P.PETID, P.PETNAME AS PetName, B.BREEDNAME
            FROM Pet P
            JOIN Is_Breed B ON P.PETID = B.PETID
            WHERE B.BREEDNAME = :breedName
        `;
        
        const result = await connection.execute(query, [breedName], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        console.log("Join query result:", JSON.stringify(result, null, 2));  // Debug logging

        if (!result || !result.rows) {
            console.error("Result or result.rows is null or undefined");
            return { success: false, error: "No data returned from the query." };
        }

        return { success: true, data: result.rows };
    }).catch(err => {
        console.error("Error fetching pets by breed:", err);
        return { success: false, error: err.message };
    });
}

console.log('deletePetById is:', deletePetById);
console.log('getPetProjection is:', getProjection);



function isOneWord(str) {
    const forbiddenWords = ["SELECT", "INSERT", "DELETE", "UPDATE", "DROP", "TABLE", "ALTER", ";", "/*", "*/"];

    // Convert input to uppercase to check against forbidden words
    const upperStr = str.toUpperCase();

    // Check if name contains any SQL keywords
    const containsSQLKeyword = forbiddenWords.some(word => upperStr.includes(word));

    return !containsSQLKeyword;
}

module.exports = {

    findCitiesWithHighDonations,
    insertAppointmentTable,
    getAllAdopters,
    updateAdopter,
    getPetCountByBreed,
    deletePetById,
    getProjection,
    getPetsByBreed,
//     testOracleConnection,
//     fetchDemotableFromDb,
//     initiateDemotable, 
//     insertDemotable, 
//     updateNameDemotable, 
//     countDemotable,
    findPetsThatPlayAllGamesDivision,
    findBreedsSelection,
    findNumberPetsOfBreedHaving3

};