CREATE TABLE IF NOT EXISTS user (
    playerId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nickname VARCHAR(36) UNIQUE,
    password VARCHAR(255) NOT NULL,
    coin INT DEFAULT 0,
    finalCheck BOOL DEFAULT FALSE,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_unlock_characters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    playerId INT NOT NULL,
    cerbe BOOL DEFAULT TRUE,
    uni BOOL DEFAULT TRUE,
    nix BOOL DEFAULT TRUE,
    chad BOOL DEFAULT FALSE,
    miho BOOL DEFAULT FALSE,
    levi BOOL DEFAULT FALSE,
    wyv BOOL DEFAULT FALSE,
    drago BOOL DEFAULT FALSE,
    kiri BOOL DEFAULT FALSE,

    FOREIGN KEY (playerId) REFERENCES user (playerId) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_character (
    uuid VARCHAR(36) PRIMARY KEY,
    playerId INT NOT NULL,
    character_class INT NOT NULL,
    level INT DEFAULT 1,
    soul INT DEFAULT 0,
    FOREIGN KEY (playerId) REFERENCES user (playerId) ON DELETE CASCADE
);