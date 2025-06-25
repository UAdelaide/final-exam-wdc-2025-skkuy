--This is the code for mysql2 that I used for the part2 section, if you didn't use it, there may be a problem with the web part. (I didn't upload it before because I typed the code creation sql directly into the terminal)
-- Connect to MySQL
mysql -u root -p

-- Use the database
USE DogWalkService;

-- Create the tables
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('owner', 'walker') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Dogs (
    dog_id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    size ENUM('small', 'medium', 'large') NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES Users(user_id)
);

CREATE TABLE WalkRequests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    dog_id INT NOT NULL,
    requested_time DATETIME NOT NULL,
    duration_minutes INT NOT NULL,
    location VARCHAR(255) NOT NULL,
    status ENUM('open', 'accepted', 'completed', 'cancelled') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dog_id) REFERENCES Dogs(dog_id)
);

-- Insert test data
INSERT INTO Users (username, email, password_hash, role) VALUES
('alice123', 'alice@example.com', 'hashed123', 'owner'),
('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
('carol123', 'carol@example.com', 'hashed789', 'owner'),
('zzz', 'zzz@example.com', 'hashed110', 'owner'),
('fff', 'fff@example.com', 'hashed120', 'walker');

INSERT INTO Dogs (owner_id, name, size) VALUES
(1, 'Max', 'medium'),
(3, 'Bella', 'small'),
(1, 'fzz', 'large'),
(3, 'Lunlp', 'medium'),
(4, 'docz', 'small');
