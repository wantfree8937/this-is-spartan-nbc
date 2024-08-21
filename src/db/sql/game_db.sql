CREATE TABLE IF NOT EXISTS user_stat (
    class INT PRIMARY KEY,
    maxHp INT,
    maxMp INT,
    atk INT,
    def INT,
    magic INT,
    speed INT,
    upgradeCost INT
);

INSERT INTO user_stat (class, maxHp, maxMp, atk, def, magic, speed, upgradeCost) VALUES
(1001, 350, 100, 250, 40, 290, 3, 100),
(1002, 350, 100, 240, 40, 300, 3, 100),
(1003, 350, 100, 260, 40, 280, 3, 100),
(1004, 600, 200, 380, 65, 420, 3, 200),
(1005, 550, 400, 310, 60, 450, 3, 200),
(1006, 1300, 250, 500, 85, 540, 3, 300),
(1007, 1200, 400, 430, 80, 560, 3, 300),
(1008, 1900, 400, 800, 105, 900, 3, 400),
(1009, 1800, 600, 700, 100, 950, 3, 400);


CREATE TABLE IF NOT EXISTS monster_stat (
    monsterIdx INT PRIMARY KEY,
    monsterModel INT,
    monsterName VARCHAR(255),
    monsterHp INT,
    monsterAttack INT,
    monsterDefense INT,
    soul INT,
    coin INT
);


INSERT INTO monster_stat (monsterIdx, monsterModel, monsterName, monsterHp, monsterAttack, monsterDefense, soul, coin) VALUES
(0, 2001, '초급 일반 1', 400, 75, 20, 10, 5),
(1, 2002, '초급 일반 2', 410, 74, 20, 10, 5),
(2, 2003, '초급 일반 3', 420, 73, 20, 10, 5),
(3, 2004, '초급 일반 4', 450, 72, 20, 10, 5),
(4, 2005, '초급 일반 5', 460, 71, 20, 10, 5),
(5, 2006, '초급 일반 6', 470, 72, 20, 10, 5),
(6, 2007, '초급 일반 7', 480, 73, 20, 10, 5),
(7, 2008, '초급 일반 8', 500, 72, 20, 10, 5),
(8, 2009, '고급 일반 1', 1000, 90, 30, 20, 10),
(9, 2010, '고급 일반 2', 1010, 91, 30, 20, 10),
(10, 2011, '고급 일반 3', 1020, 92, 30, 20, 10),
(11, 2012, '고급 일반 4', 1040, 93, 30, 20, 10),
(12, 2013, '고급 일반 5', 1050, 94, 30, 20, 10),
(13, 2014, '고급 일반 6', 1070, 95, 30, 20, 10),
(14, 2015, '고급 일반 7', 1080, 93, 30, 20, 10),
(15, 2016, '고급 일반 8', 1100, 94, 30, 20, 10),
(16, 2017, '초급 보스 1', 1750, 150, 60, 40, 20),
(17, 2018, '초급 보스 2', 1760, 152, 60, 40, 20),
(18, 2019, '초급 보스 3', 1770, 154, 60, 40, 20),
(19, 2020, '초급 보스 4', 1780, 156, 60, 40, 20),
(20, 2021, '초급 보스 5', 1790, 158, 60, 40, 20),
(21, 2022, '초급 보스 6', 1800, 160, 60, 40, 20),
(22, 2023, '고급 보스 1', 2500, 250, 80, 50, 40),
(23, 2024, '고급 보스 2', 2520, 248, 80, 50, 40),
(24, 2025, '고급 보스 3', 2540, 246, 80, 50, 40),
(25, 2026, '고급 보스 4', 2560, 244, 80, 50, 40),
(26, 2027, '고급 보스 5', 2580, 242, 80, 50, 40),
(27, 2028, '고급 보스 6', 2600, 240, 80, 50, 40),
(28, 2029, '최종 보스', 12000, 300, 150, 100, 100);

CREATE TABLE IF NOT EXISTS map_code (
    mapCode INT
);

INSERT INTO map_code (mapCode) VALUES
(5001),
(5002),
(5003),
(5004),
(5005),
(5006),
(5007);

CREATE TABLE IF NOT EXISTS text_info (
    name VARCHAR(255),
    version VARCHAR(255),
    msg VARCHAR(255),
    typingAnimation BOOLEAN,
    alignment_x INT,
    alignment_y INT,
    textColor_r INT,
    textColor_g INT,
    textColor_b INT,
    screenColor_r INT,
    screenColor_g INT,
    screenColor_b INT
);

INSERT INTO text_info (
    name, version, msg, typingAnimation, 
    alignment_x, alignment_y, 
    textColor_r, textColor_g, textColor_b, 
    screenColor_r, screenColor_g, screenColor_b
    ) VALUES
("textInfo", "1.0.0", "던전에 오신걸 환영합니다.", false, 0, 0, 255, 255, 255, 0, 0, 0);