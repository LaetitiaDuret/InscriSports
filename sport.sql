DROP TABLE Seance ;
DROP TABLE Sport ;
DROP TABLE Student ;
DROP TABLE Subscription ;
DROP TABLE Inscription ;

CREATE TABLE Student
(
    id int IDENTITY PRIMARY KEY ,
    password VARCHAR(30) NOT NULL ,
    firstname VARCHAR(30) NOT NULL ,
    lastname VARCHAR(30) NOT NULL ,
    email VARCHAR(70) NOT NULL ,
    phone_number VARCHAR(10),
    has_car bit,
    has_licence bit
);

CREATE TABLE Sport (
    id int IDENTITY PRIMARY KEY ,
    sport_name VARCHAR(30) NOT NULL ,
    president_id int ,
    description VARCHAR(30) ,
    FOREIGN KEY (president_id) REFERENCES Student(id)
);

CREATE TABLE Seance (
    id int IDENTITY PRIMARY KEY ,
    description VARCHAR(30) ,
    sport_id int ,
    FOREIGN KEY (sport_id) REFERENCES Sport(id) 
);

CREATE TABLE Subscription (
    student_id int NOT NULL ,
    sport_id int NOT NULL ,
    PRIMARY KEY (student_id, sport_id) ,
    FOREIGN KEY (student_id) REFERENCES Student(id) ,
    FOREIGN KEY (sport_id) REFERENCES Sport(id)
);

CREATE TABLE Inscription (
    student_id int NOT NULL ,
    seance_id int NOT NULL ,
    is_selected bit ,
    PRIMARY KEY (student_id, seance_id) ,
    FOREIGN KEY (student_id) REFERENCES Student(id) ,
    FOREIGN KEY (seance_id) REFERENCES Seance(id)
);

INSERT INTO Student (password, firstname, lastname, email, phone_number, has_car, has_licence) VALUES  ("lol","Laeti", "Duret", "laeti@tb.fr", "06...", 0, 1)
