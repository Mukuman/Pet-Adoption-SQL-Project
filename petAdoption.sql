-- Drop existing tables
DROP TABLE Related CASCADE CONSTRAINTS;
DROP TABLE Interested_In CASCADE CONSTRAINTS;
DROP TABLE Donated CASCADE CONSTRAINTS;
DROP TABLE Donation CASCADE CONSTRAINTS;
DROP TABLE Works_Shift CASCADE CONSTRAINTS;
DROP TABLE Staff CASCADE CONSTRAINTS;
DROP TABLE Adopter CASCADE CONSTRAINTS;
DROP TABLE Pet CASCADE CONSTRAINTS;
DROP TABLE Vaccination CASCADE CONSTRAINTS;
DROP TABLE Diet CASCADE CONSTRAINTS;
DROP TABLE Has_Vaccine CASCADE CONSTRAINTS;
DROP TABLE Has_Diet CASCADE CONSTRAINTS;
DROP TABLE Game CASCADE CONSTRAINTS;
DROP TABLE Plays CASCADE CONSTRAINTS;
DROP TABLE Book_Appointment CASCADE CONSTRAINTS;
DROP TABLE Is_Breed CASCADE CONSTRAINTS;
DROP TABLE Breed CASCADE CONSTRAINTS;

-- Create Staff table
CREATE TABLE Staff (
    StaffID NUMBER(10) NOT NULL,
    StaffName VARCHAR2(50) NOT NULL,
    Email VARCHAR2(255) UNIQUE NOT NULL,
    Address VARCHAR2(255),
    PostalCode VARCHAR2(6),
    City VARCHAR2(20),
    PRIMARY KEY (StaffID)
);

GRANT SELECT ON Staff TO public;

-- Create Adopter table
CREATE TABLE Adopter (
    AdopterID NUMBER(10) NOT NULL,
    AdopterName VARCHAR2(50) NOT NULL,
    Email VARCHAR2(255) UNIQUE NOT NULL,
    Address VARCHAR2(255),
    PostalCode VARCHAR2(6),
    City VARCHAR2(20),
    PRIMARY KEY (AdopterID)
);

GRANT SELECT ON Adopter TO public;

-- Create Pet table
CREATE TABLE Pet (
    PetID NUMBER(10) NOT NULL,
    PetName VARCHAR2(50),
    Age INTEGER,
    Status CHAR(1),
    City VARCHAR2(20),
    PRIMARY KEY (PetID)
);

GRANT SELECT ON Pet TO public;

-- Create Works_Shift table
CREATE TABLE Works_Shift (
    ShiftDate DATE,
    TotalDuration INTEGER,
    ShiftStart TIMESTAMP,
    ShiftEnd TIMESTAMP,
    StaffID NUMBER(10),
    ShiftType VARCHAR2(20),
    PRIMARY KEY (ShiftDate, ShiftStart, ShiftEnd),
    FOREIGN KEY (StaffID) REFERENCES Staff ON DELETE CASCADE
);

GRANT SELECT ON Works_Shift TO public;

-- Create Donation table
CREATE TABLE Donation (
    TransactionID NUMBER(10) NOT NULL,
    PaymentMethod CHAR(4),
    Amount DECIMAL(10, 2),
    AdopterID NUMBER(10),
    PRIMARY KEY (TransactionID),
    FOREIGN KEY (AdopterID) REFERENCES Adopter
);

GRANT SELECT ON Donation TO public;

-- Create Donated table
CREATE TABLE Donated (
    TransactionID NUMBER(10),
    AdopterID NUMBER(10),
    PRIMARY KEY (TransactionID, AdopterID),
    FOREIGN KEY (TransactionID) REFERENCES Donation ON DELETE CASCADE,
    FOREIGN KEY (AdopterID) REFERENCES Adopter ON DELETE CASCADE
);

GRANT SELECT ON Donated TO public;

-- Create Interested_In table
CREATE TABLE Interested_In (
    PetID NUMBER(10),
    AdopterID NUMBER(10),
    PRIMARY KEY (PetID, AdopterID),
    FOREIGN KEY (PetID) REFERENCES Pet ON DELETE CASCADE,
    FOREIGN KEY (AdopterID) REFERENCES Adopter ON DELETE CASCADE
);

GRANT SELECT ON Interested_In TO public;

-- Create Related table
CREATE TABLE Related (
    PetID NUMBER(10),
    RelatedPetID NUMBER(10),
    Relation VARCHAR2(20),
    PRIMARY KEY (PetID, RelatedPetID),
    FOREIGN KEY (PetID) REFERENCES Pet ON DELETE CASCADE,
    FOREIGN KEY (RelatedPetID) REFERENCES Pet ON DELETE CASCADE
);

GRANT SELECT ON Related TO public;

-- Create Vaccination table
CREATE TABLE Vaccination (
    VaccineID NUMBER(10) NOT NULL,
    VaccineName VARCHAR2(50),
    VetName VARCHAR2(50),
    VaccinationDate DATE,
    NextDue DATE,
    EffectivenessPeriod INTEGER,
    PRIMARY KEY (VaccineID)
);

GRANT SELECT ON Vaccination TO public;

-- Create Has_Vaccine table
CREATE TABLE Has_Vaccine (
    VaccineID NUMBER(10),
    PetID NUMBER(10),
    PRIMARY KEY (VaccineID, PetID),
    FOREIGN KEY (VaccineID) REFERENCES Vaccination ON DELETE CASCADE,
    FOREIGN KEY (PetID) REFERENCES Pet ON DELETE CASCADE
);

GRANT SELECT ON Has_Vaccine TO public;

-- Create Diet table
CREATE TABLE Diet (
    DietID NUMBER(10) NOT NULL,
    PortionSize DECIMAL(10, 2),
    Allergies VARCHAR2(200),
    MealFrequency INTEGER,
    Calories VARCHAR2(100),
    ChosenFoods VARCHAR2(200),
    AvailableFoods VARCHAR2(200),
    RestrictedFoods VARCHAR2(200),
    PRIMARY KEY (DietID)
);

GRANT SELECT ON Diet TO public;

-- Create Has_Diet table
CREATE TABLE Has_Diet (
    DietID NUMBER(10),
    PetID NUMBER(10),
    PRIMARY KEY (DietID, PetID),
    FOREIGN KEY (DietID) REFERENCES Diet ON DELETE CASCADE,
    FOREIGN KEY (PetID) REFERENCES Pet ON DELETE CASCADE
);

GRANT SELECT ON Has_Diet TO public;

-- Create Game table
CREATE TABLE Game (
    GameID NUMBER(10) NOT NULL,
    GameName VARCHAR2(50) UNIQUE NOT NULL,
    Description VARCHAR2(255),
    GameTime TIMESTAMP,
    PRIMARY KEY (GameID)
);

GRANT SELECT ON Game TO public;

-- Create Plays table
CREATE TABLE Plays (
    GameID NUMBER(10),
    PetID NUMBER(10),
    PRIMARY KEY (GameID, PetID),
    FOREIGN KEY (GameID) REFERENCES Game ON DELETE CASCADE,
    FOREIGN KEY (PetID) REFERENCES Pet ON DELETE CASCADE
);

GRANT SELECT ON Plays TO public;

-- Create Book_Appointment table
CREATE TABLE Book_Appointment (
    AppointmentDate DATE,
    AppointmentTime TIMESTAMP,
    AdopterID NUMBER(10) NOT NULL,
    PetID NUMBER(10) NOT NULL,
    PRIMARY KEY (AppointmentDate, AdopterID, PetID),
    FOREIGN KEY (AdopterID) REFERENCES Adopter ON DELETE CASCADE,
    FOREIGN KEY (PetID) REFERENCES Pet ON DELETE CASCADE
);

GRANT SELECT ON Book_Appointment TO public;

-- Create Breed table
CREATE TABLE Breed (
    BreedName VARCHAR2(50) NOT NULL,
    CoatColor VARCHAR2(10),
    Nature VARCHAR2(20),
    PRIMARY KEY (BreedName)
);

GRANT SELECT ON Breed TO public;

-- Create Is_Breed table
CREATE TABLE Is_Breed (
    BreedName VARCHAR2(50),
    PetID NUMBER(10),
    PRIMARY KEY (BreedName, PetID),
    FOREIGN KEY (BreedName) REFERENCES Breed ON DELETE CASCADE,
    FOREIGN KEY (PetID) REFERENCES Pet ON DELETE CASCADE
);

GRANT SELECT ON Is_Breed TO public;
-- Insert into Staff
insert into Staff values (1, 'Alice Johnson', 'alice.johnson@example.com', '123 Elm St.', '12345', 'New York');
insert into Staff values (2, 'Bob Smith', 'bob.smith@example.com', '456 Oak St.', '23456', 'Los Angeles');
insert into Staff values (3, 'Charlie Brown', 'charlie.brown@example.com', '789 Pine St.', '34567', 'Chicago');
insert into Staff values (4, 'Diana Prince', 'diana.prince@example.com', '321 Maple St.', '45678', 'San Francisco');
insert into Staff values (5, 'Edward Harris', 'edward.harris@example.com', '654 Cedar St.', '56789', 'Houston');

-- Insert into Adopter
insert into Adopter values (1, 'John Doe', 'john.doe@example.com', '123 Oak St.', '67890', 'San Diego');
insert into Adopter values (2, 'Jane Smith', 'jane.smith@example.com', '456 Birch St.', '78901', 'Austin');
insert into Adopter values (3, 'Mary Johnson', 'mary.johnson@example.com', '789 Cedar St.', '89012', 'Dallas');
insert into Adopter values (4, 'Michael Brown', 'michael.brown@example.com', '321 Pine St.', '90123', 'New York');
insert into Adopter values (5, 'Patricia White', 'patricia.white@example.com', '654 Oak St.', '01234', 'Los Angeles');

-- Insert into Pet
insert into Pet values (1, 'Buddy', 2, 'A', 'San Diego');
insert into Pet values (2, 'Lucy', 3, 'A', 'Austin');
insert into Pet values (3, 'Bella', 1, 'A', 'Dallas');
insert into Pet values (4, 'Max', 4, 'A', 'New York');
insert into Pet values (5, 'Charlie', 2, 'A', 'Los Angeles');
INSERT INTO Pet VALUES (6, 'Rocky', 6, 'A', 'Chicago');
INSERT INTO Pet VALUES (7, 'Daisy', 7, 'A', 'Miami');
INSERT INTO Pet VALUES (8, 'Sadie', 8, 'A', 'San Francisco');
INSERT INTO Pet VALUES (9, 'Lola', 5, 'A', 'Seattle');
INSERT INTO Pet VALUES (10, 'Toby', 9, 'A', 'Boston');
INSERT INTO Pet VALUES (11, 'Cooper', 2, 'A', 'Denver');
INSERT INTO Pet VALUES (12, 'Molly', 3, 'A', 'Phoenix');
INSERT INTO Pet VALUES (13, 'Duke', 4, 'A', 'Houston');
INSERT INTO Pet VALUES (14, 'Maggie', 5, 'A', 'Atlanta');
INSERT INTO Pet VALUES (15, 'Bailey', 6, 'A', 'Las Vegas');

-- Insert into Works_Shift
insert into Works_Shift values (TO_DATE('2025-03-01', 'YYYY-MM-DD'), 8, TO_TIMESTAMP('2025-03-01 08:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-03-01 16:00:00', 'YYYY-MM-DD HH24:MI:SS'), 1, 'Morning');
insert into Works_Shift values (TO_DATE('2025-03-02', 'YYYY-MM-DD'), 8, TO_TIMESTAMP('2025-03-02 08:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-03-02 16:00:00', 'YYYY-MM-DD HH24:MI:SS'), 2, 'Morning');
insert into Works_Shift values (TO_DATE('2025-03-03', 'YYYY-MM-DD'), 8, TO_TIMESTAMP('2025-03-03 16:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-03-03 23:00:00', 'YYYY-MM-DD HH24:MI:SS'), 3, 'Evening');
insert into Works_Shift values (TO_DATE('2025-03-04', 'YYYY-MM-DD'), 8, TO_TIMESTAMP('2025-03-04 16:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-03-04 23:00:00', 'YYYY-MM-DD HH24:MI:SS'), 4, 'Evening');
insert into Works_Shift values (TO_DATE('2025-03-05', 'YYYY-MM-DD'), 8, TO_TIMESTAMP('2025-03-05 08:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-03-05 16:00:00', 'YYYY-MM-DD HH24:MI:SS'), 5, 'Morning');

-- Insert into Donation
insert into Donation values (1, 'CARD', 100.00, 1);
insert into Donation values (2, 'CASH', 50.00, 2);
insert into Donation values (3, 'CARD', 75.00, 3);
insert into Donation values (4, 'CASH', 30.00, 4);
insert into Donation values (5, 'CARD', 120.00, 5);

-- Insert into Donated
insert into Donated values (1, 1);
insert into Donated values (2, 2);
insert into Donated values (3, 3);
insert into Donated values (4, 4);
insert into Donated values (5, 5);

-- Insert into Interested_In
insert into Interested_In values (1, 1);
insert into Interested_In values (2, 2);
insert into Interested_In values (3, 3);
insert into Interested_In values (4, 4);
insert into Interested_In values (5, 5);

-- Insert into Related
insert into Related values (1, 2, 'Sibling');
insert into Related values (2, 3, 'Sibling');
insert into Related values (3, 4, 'Parent');
insert into Related values (4, 5, 'Parent');
insert into Related values (1, 5, 'Cousin');

-- Insert into Vaccination
insert into Vaccination values (1, 'Rabies', 'Dr. Smith', TO_DATE('2025-01-01', 'YYYY-MM-DD'), TO_DATE('2025-12-31', 'YYYY-MM-DD'), 12);
insert into Vaccination values (2, 'Distemper', 'Dr. Miller', TO_DATE('2025-02-01', 'YYYY-MM-DD'), TO_DATE('2025-11-30', 'YYYY-MM-DD'), 10);
insert into Vaccination values (3, 'Parvovirus', 'Dr. Johnson', TO_DATE('2025-03-01', 'YYYY-MM-DD'), TO_DATE('2025-09-30', 'YYYY-MM-DD'), 9);
insert into Vaccination values (4, 'Bordetella', 'Dr. Lee', TO_DATE('2025-04-01', 'YYYY-MM-DD'), TO_DATE('2025-10-31', 'YYYY-MM-DD'), 6);
insert into Vaccination values (5, 'Leptospirosis', 'Dr. Wang', TO_DATE('2025-05-01', 'YYYY-MM-DD'), TO_DATE('2025-12-01', 'YYYY-MM-DD'), 12);

-- Insert into Has_Vaccine
insert into Has_Vaccine values (1, 1);
insert into Has_Vaccine values (2, 2);
insert into Has_Vaccine values (3, 3);
insert into Has_Vaccine values (4, 4);
insert into Has_Vaccine values (5, 5);

-- Insert into Diet
insert into Diet values (1, 50.00, 'None', 3, 'High Protein', 'Chicken, Beef', 'Rice, Carrots', 'Grains, Wheat');
insert into Diet values (2, 30.00, 'Wheat', 2, 'Low Carb', 'Fish, Pork', 'Peas, Carrots', 'Soy');
insert into Diet values (3, 40.00, 'None', 3, 'Balanced', 'Chicken, Turkey', 'Potatoes, Spinach', 'Nuts');
insert into Diet values (4, 60.00, 'Peanuts', 2, 'High Protein', 'Beef, Pork', 'Sweet Potatoes, Broccoli', 'Corn');
insert into Diet values (5, 45.00, 'None', 2, 'Balanced', 'Lamb, Chicken', 'Quinoa, Kale', 'Soy');

-- Insert into Has_Diet
insert into Has_Diet values (1, 1);
insert into Has_Diet values (2, 2);
insert into Has_Diet values (3, 3);
insert into Has_Diet values (4, 4);
insert into Has_Diet values (5, 5);

-- Insert into Game
insert into Game values (1, 'Fetch', 'A game where the pet retrieves a thrown object', TO_TIMESTAMP('2025-03-01 10:00:00', 'YYYY-MM-DD HH24:MI:SS'));
insert into Game values (2, 'Tug-of-War', 'A game where the pet pulls on an object in opposition to a human or another pet', TO_TIMESTAMP('2025-03-02 11:00:00', 'YYYY-MM-DD HH24:MI:SS'));
insert into Game values (3, 'Hide-and-Seek', 'A game where the pet searches for hidden objects', TO_TIMESTAMP('2025-03-03 14:00:00', 'YYYY-MM-DD HH24:MI:SS'));
insert into Game values (4, 'Chase', 'A game where the pet chases a moving object', TO_TIMESTAMP('2025-03-04 16:00:00', 'YYYY-MM-DD HH24:MI:SS'));
insert into Game values (5, 'Fetch the Stick', 'A game where the pet fetches a stick thrown by the owner', TO_TIMESTAMP('2025-03-05 10:00:00', 'YYYY-MM-DD HH24:MI:SS'));
INSERT INTO Game VALUES (6, 'Catch', 'A game where the pet catches an object mid-air', TO_TIMESTAMP('2025-03-06 15:00:00', 'YYYY-MM-DD HH24:MI:SS'));
INSERT INTO Game VALUES (7, 'Obstacle Course', 'A game where the pet navigates through obstacles', TO_TIMESTAMP('2025-03-07 12:00:00', 'YYYY-MM-DD HH24:MI:SS'));
INSERT INTO Game VALUES (8, 'Find the Treat', 'A game where the pet finds hidden treats', TO_TIMESTAMP('2025-03-08 09:00:00', 'YYYY-MM-DD HH24:MI:SS'));

INSERT INTO Plays VALUES (1, 1);
INSERT INTO Plays VALUES (2, 1);
INSERT INTO Plays VALUES (3, 1);
INSERT INTO Plays VALUES (4, 1);
INSERT INTO Plays VALUES (5, 1);
INSERT INTO Plays VALUES (6, 1);
INSERT INTO Plays VALUES (7, 1);
INSERT INTO Plays VALUES (8, 1);

INSERT INTO Plays VALUES (1, 2);
INSERT INTO Plays VALUES (2, 2);
INSERT INTO Plays VALUES (3, 2);
INSERT INTO Plays VALUES (4, 2);
INSERT INTO Plays VALUES (5, 2);
INSERT INTO Plays VALUES (6, 2);
INSERT INTO Plays VALUES (7, 2);
INSERT INTO Plays VALUES (8, 2);

INSERT INTO Plays VALUES (1, 3);
INSERT INTO Plays VALUES (2, 3);
INSERT INTO Plays VALUES (3, 3);
INSERT INTO Plays VALUES (4, 3);
INSERT INTO Plays VALUES (5, 3);
INSERT INTO Plays VALUES (6, 3);
INSERT INTO Plays VALUES (7, 3);
INSERT INTO Plays VALUES (8, 3);

INSERT INTO Plays VALUES (1, 4);
INSERT INTO Plays VALUES (2, 4);
INSERT INTO Plays VALUES (3, 4);
INSERT INTO Plays VALUES (4, 4);
INSERT INTO Plays VALUES (5, 4);
INSERT INTO Plays VALUES (6, 4);
INSERT INTO Plays VALUES (7, 4);
INSERT INTO Plays VALUES (8, 4);

INSERT INTO Plays VALUES (1, 5);
INSERT INTO Plays VALUES (2, 5);
INSERT INTO Plays VALUES (3, 5);
INSERT INTO Plays VALUES (4, 5);
INSERT INTO Plays VALUES (5, 5);
INSERT INTO Plays VALUES (6, 5);
INSERT INTO Plays VALUES (7, 5);
INSERT INTO Plays VALUES (8, 5);


-- Insert into Book_Appointment
insert into Book_Appointment values (TO_DATE('2025-03-01', 'YYYY-MM-DD'), TO_TIMESTAMP('2025-03-01 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), 1, 1);
insert into Book_Appointment values (TO_DATE('2025-03-02', 'YYYY-MM-DD'), TO_TIMESTAMP('2025-03-02 11:00:00', 'YYYY-MM-DD HH24:MI:SS'), 2, 2);
insert into Book_Appointment values (TO_DATE('2025-03-03', 'YYYY-MM-DD'), TO_TIMESTAMP('2025-03-03 14:00:00', 'YYYY-MM-DD HH24:MI:SS'), 3, 3);
insert into Book_Appointment values (TO_DATE('2025-03-04', 'YYYY-MM-DD'), TO_TIMESTAMP('2025-03-04 16:00:00', 'YYYY-MM-DD HH24:MI:SS'), 4, 4);
insert into Book_Appointment values (TO_DATE('2025-03-05', 'YYYY-MM-DD'), TO_TIMESTAMP('2025-03-05 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), 5, 5);

-- Insert into Breed
INSERT INTO Breed VALUES ('Golden Retriever', 'Golden', 'Friendly');
INSERT INTO Breed VALUES ('Labrador', 'Yellow', 'Friendly');
INSERT INTO Breed VALUES ('Poodle', 'White', 'Intelligent');
INSERT INTO Breed VALUES ('Bulldog', 'Brown', 'Stubborn');
INSERT INTO Breed VALUES ('Beagle', 'Tri-color', 'Curious');
INSERT INTO Breed VALUES ('German Shepherd', 'Black & Tan', 'Loyal');


-- Insert into Is_Breed
-- Assign breeds to pets
INSERT INTO Is_Breed VALUES ('Golden Retriever', 1);
INSERT INTO Is_Breed VALUES ('Labrador', 2);
INSERT INTO Is_Breed VALUES ('Poodle', 3);
INSERT INTO Is_Breed VALUES ('Bulldog', 4);
INSERT INTO Is_Breed VALUES ('Beagle', 5);

-- Ensuring some breeds have at least 3 pets
INSERT INTO Is_Breed VALUES ('Golden Retriever', 6);
INSERT INTO Is_Breed VALUES ('Golden Retriever', 7);
INSERT INTO Is_Breed VALUES ('Golden Retriever', 8);

INSERT INTO Is_Breed VALUES ('Labrador', 9);
INSERT INTO Is_Breed VALUES ('Labrador', 10);

INSERT INTO Is_Breed VALUES ('Beagle', 11);
INSERT INTO Is_Breed VALUES ('Beagle', 12);
INSERT INTO Is_Breed VALUES ('Beagle', 13);
INSERT INTO Is_Breed VALUES ('Beagle', 14);
INSERT INTO Is_Breed VALUES ('Beagle', 15);





