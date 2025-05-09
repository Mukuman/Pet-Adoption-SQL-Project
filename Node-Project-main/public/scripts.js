/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */

async function resetDatabase() {
    const response = await fetch("/reset-database", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "demotable initiated successfully!";
    } else {
        alert("Error initiating table!");
    }
}



async function findCitiesWithHighDonations() {
    const response = await fetch('/high-donation-cities', {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('citiesResultMsg');
    const tableElement = document.getElementById('citiesTable');
    const tableBody = tableElement.querySelector('tbody');

    tableBody.innerHTML = ''; // Clearing previous results

    if (responseData.success) {
        tableElement.style.display = 'table';
        messageElement.textContent = "Cities found:";
        
        responseData.data.forEach(city => {
            const row = tableBody.insertRow();

            const cityCell = row.insertCell(0);
            cityCell.textContent = city.CITY;
            
            const amountCell = row.insertCell(1);
            amountCell.textContent = `$${city.AVG_DONATION.toFixed(2)}`;
        });
    } else {
        tableElement.style.display = 'none';
        messageElement.textContent = "No cities found with above average donations.";
    }
}

async function bookAppointment(event) {
    event.preventDefault();

    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    const adopterId = document.getElementById('adopterId').value;
    const petId = document.getElementById('petId').value;

    const response = await fetch('/book-appointment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            date: date,
            time: time,
            adopterId: adopterId,
            petId: petId
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('appointmentResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Appointment booked successfully!";
        messageElement.style.color = "green";
    } else {
        if (responseData.error === 'ADOPTER_NOT_FOUND') {
            messageElement.textContent = "Error: Adopter does not exist!";
        } else if (responseData.error === 'PET_NOT_FOUND') {
            messageElement.textContent = "Error: Pet does not exist!";
        } else {
            messageElement.textContent = "Error booking appointment!";
        }
        messageElement.style.color = "red";
    }
}

async function updateAdopter(event) {
    event.preventDefault();

    const adopterId = document.getElementById('updateAdopterId').value;
    const field = document.getElementById('updateField').value;
    const value = document.getElementById('updateValue').value;
    const messageElement = document.getElementById('updateAdopterResultMsg');

    const response = await fetch('/update-adopter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            adopterId: adopterId,
            field: field,
            value: value
        })
    });

    const responseData = await response.json();

    if (responseData.success) {
        messageElement.textContent = `${field} updated successfully!`;
        messageElement.style.color = "green";
        await fetchAndDisplayAdopters();
    } else {
        if (responseData.error === 'UNIQUE_VIOLATION') {
            messageElement.textContent = "Email already exists! Please use a different email.";
        } else if (responseData.error === 'ADOPTER_NOT_FOUND') {
            messageElement.textContent = "Adopter not found!";
        } else {
            messageElement.textContent = "Error updating adopter!";
        }
        messageElement.style.color = "red";
    }
}

async function fetchAndDisplayAdopters() {
    const response = await fetch('/get-adopters');
        const responseData = await response.json();
        const tableBody = document.querySelector('#adoptersTable tbody');
        
        tableBody.innerHTML = '';
        
        if (responseData.success && responseData.data.length > 0) {
            responseData.data.forEach(adopter => {
                const row = tableBody.insertRow();
                row.insertCell(0).textContent = adopter.ADOPTERID;
                row.insertCell(1).textContent = adopter.ADOPTERNAME;
                row.insertCell(2).textContent = adopter.EMAIL;
                row.insertCell(3).textContent = adopter.ADDRESS;
                row.insertCell(4).textContent = adopter.CITY;
                row.insertCell(5).textContent = adopter.POSTALCODE;
            });
        }
}


/**
 * Fetches and displays pets that play all games.
 * Calls the backend API and updates the webpage accordingly.
 */
async function fetchPetsThatPlayAllGames() {
    const response = await fetch('/findPetsThatPlayAllGamesDivision', { method: "GET" });

    // const text = await response.text();
    //     console.log("Raw Response:", text);

    const data = await response.json();

    const tableBody = document.querySelector('#allGamesPetsList tbody');
    tableBody.innerHTML = ""; // Clear existing rows

    if (data.success) {
        data.pets.forEach(pet => {
            let row = tableBody.insertRow();
            row.insertCell(0).textContent = pet[0];
            row.insertCell(1).textContent = pet[1];

        });
    } else {
        alert(data.message);
    }
}

/**
 * Fetches and displays pets of a selected breed.
 * Reads the breed input from the form.
 */
async function fetchBreeds(event) {
    event.preventDefault();

    // Collect all conditions from the form
    const conditions = [];
    const conditionElements = document.querySelectorAll(".condition");

    conditionElements.forEach((condition, index) => {
        const attribute = condition.querySelector(".attribute").value;
        const value = condition.querySelector(".valueInput").value.trim();
        const logic = index > 0 ? condition.querySelector(".logicOperator").value : null; // No logic for the first condition

        if (value) {
            conditions.push({ attribute, value, logic });
        }
    });

    if (conditions.length === 0) {
        alert("Please add at least one condition.");
        return;
    }

    const response = await fetch("/findBreedsSelection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conditions })
    });

    const data = await response.json();
    const tableBody = document.querySelector("#breedPetsList tbody");
    tableBody.innerHTML = ""; // Clear existing rows

    if (data.success) {
        data.tableValues.forEach(tuple => {
            let row = tableBody.insertRow();
            tuple.forEach((cellData, index) => {
                row.insertCell(index).textContent = cellData;
            });
        });
    } else {
        alert(data.message);
    }
}

async function addQueryRow() {
    const container = document.getElementById("conditionsContainer");

    const conditionDiv = document.createElement("div");
    conditionDiv.classList.add("condition");

    conditionDiv.innerHTML = `
        <select class="logicOperator">
            <option value="AND">AND</option>
            <option value="OR">OR</option>
        </select>

        <select class="attribute">
            <option value="BreedName">Breed Name</option>
            <option value="CoatColor">Coat Color</option>
            <option value="Nature">Nature</option>
        </select>
        
        <input type="text" class="valueInput" placeholder="Enter value" required>

        <button type="button" class="removeCondition">x</button>
    `;

    container.appendChild(conditionDiv);

    // Remove condition when clicking 
    conditionDiv.querySelector(".removeCondition").addEventListener("click", function () {
        conditionDiv.remove();
    });
}


/**
 * Fetches and displays breeds with at least 3 pets.
 */
async function fetchBreedsWithAtLeast3Pets() {
    const response = await fetch('/findNumberPetsOfBreedHaving3', { method: "GET" });
    const data = await response.json();
    const tableBody = document.querySelector('#breedsWith3PetsList tbody');
    tableBody.innerHTML = ""; // Clear existing rows

    if (data.success) {
        data.pets.forEach(breed => {
            let row = tableBody.insertRow();
            row.insertCell(0).textContent = breed[0];
            row.insertCell(1).textContent = breed[1];
        });
    } else {
        alert(data.message);
    }
}

async function fetchPetCountByBreed() {
    console.log("Button Pressed");  

    try {
        const response = await fetch("/getPetCountByBreed", { method: 'GET' });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        const messageElement = document.getElementById('query7ResultMsg');
        
        if (responseData.success) {
            const tableElement = document.getElementById('petCountByBreedTable');
            const tableBody = tableElement.querySelector('tbody');
            
            if (tableBody) {
                tableBody.innerHTML = '';
            }

            responseData.data.forEach(row => {
                const tr = document.createElement('tr');
                
                Object.values(row).forEach(cellData => {
                    const td = document.createElement('td');
                    td.textContent = cellData;
                    tr.appendChild(td);
                });
                
                tableBody.appendChild(tr);
            });

            messageElement.textContent = "Here are the breed counts!!";
        } else {
            messageElement.textContent = "Error fetching pet count by breed.";
        }
    } catch (error) {
        console.error("Error fetching pet count by breed:", error);
        alert("An error occurred while fetching pet count by breed.");
    }
}

async function deletePet(event) {
    event.preventDefault();

    const petID = document.getElementById('deletePetId').value;

    const response = await fetch('/delete-pet', {  
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ petID })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('deleteResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Pet deleted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error deleting pet!";
    }
}

async function fetchProjection() {
    const selectElement = document.getElementById("projectionAttributes");
    const selectedOptions = Array.from(selectElement.selectedOptions).map(option => option.value);

    if (selectedOptions.length === 0) {
        alert("Please select at least one attribute.");
        return;
    }

    const response = await fetch('/getProjection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attributes: selectedOptions })
    });

    const responseData = await response.json();
    const tableBody = document.querySelector('#projectionResultTable tbody');
    const tableHeader = document.querySelector('#projectionHeaders');
    
    tableBody.innerHTML = ''; // Clear results
    tableHeader.innerHTML = ''; // Clear headers

    if (responseData.success && Array.isArray(responseData.data)) {
        // Create table headers dynamically
        selectedOptions.forEach(attr => {
            const th = document.createElement('th');
            th.textContent = attr;
            tableHeader.appendChild(th);
        });

        responseData.data.forEach(row => {
            const tr = document.createElement('tr');
            selectedOptions.forEach(attr => {
                const td = document.createElement('td');
                td.textContent = row[attr] || "N/A";
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });
    } else {
        alert("Error fetching projection data.");
    }
}
async function fetchPetsByBreed() {
    console.log("Breed Button Pressed");  // debugging
    const breedName = document.getElementById('breedNameInput').value;

    try {
        const response = await fetch(`/getPetsByBreed?breedName=${encodeURIComponent(breedName)}`, { method: 'GET' });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        console.log("Join Data Received:", responseData);  

        const messageElement = document.getElementById('query6ResultMsg');
        
        if (responseData.success && Array.isArray(responseData.data)) {
            const tableElement = document.getElementById('petsByBreedTable');
            const tableBody = tableElement.querySelector('tbody');
            
            if (tableBody) {
                tableBody.innerHTML = '';  
            }

            responseData.data.forEach(row => {
                const tr = document.createElement('tr');
                
                if (typeof row === 'object' && row !== null) {
                    Object.values(row).forEach(cellData => {
                        const td = document.createElement('td');
                        td.textContent = cellData;
                        tr.appendChild(td);
                    });
                }
                
                tableBody.appendChild(tr);
            });

            messageElement.textContent = "Join query executed successfully!";
        } else {
            console.log("Received data format is not an array:", responseData.data);
            messageElement.textContent = "Received data is not in the expected format.";
        }
    } catch (error) {
        console.error("Error fetching join data:", error);
        alert("An error occurred while fetching join data.");
    }
}


// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {

    
    document.getElementById("fetchPetCountByBreed").addEventListener("click", fetchPetCountByBreed);
    document.getElementById("deletePet").addEventListener("submit", deletePet);
    document.getElementById("projectionForm").addEventListener("submit", function(event) {
        event.preventDefault();
        fetchProjection();
    });
    document.getElementById("fetchPetsByBreed").addEventListener("click", fetchPetsByBreed);
    document.getElementById("findCitiesBtn").addEventListener("click", findCitiesWithHighDonations);
    document.getElementById("bookAppointmentForm").addEventListener("submit", bookAppointment);
    document.getElementById("updateAdopterForm").addEventListener("submit", updateAdopter);
    fetchAndDisplayAdopters();
    // checkDbConnection();
//     fetchTableData();
    // document.getElementById("resetDemotable").addEventListener("click", resetDatabase);
//     document.getElementById("insertDemotable").addEventListener("submit", insertDemotable);
//     document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);
//     document.getElementById("countDemotable").addEventListener("click", countDemotable);
    document.getElementById("fetchPetsThatPlayAllGames").addEventListener("click", fetchPetsThatPlayAllGames);
    document.getElementById("fetchBreedsSelection").addEventListener("submit", fetchBreeds);
    document.getElementById("fetchBreedWithAtLeast3Pets").addEventListener("click", fetchBreedsWithAtLeast3Pets);
    document.getElementById("addCondition").addEventListener("click", addQueryRow);

};

