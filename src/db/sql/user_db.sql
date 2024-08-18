CREATE TABLE IF NOT EXISTS user (
    playerId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nickname VARCHAR(36) UNIQUE,
    coin INT DEFAULT 0,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_character (
    uuid VARCHAR(36) PRIMARY KEY,
    playerId INT NOT NULL,
    character_class INT NOT NULL,
    level INT DEFAULT 1,
    soul INT DEFAULT 0,
    FOREIGN KEY (playerId) REFERENCES user (playerId) ON DELETE CASCADE
);
