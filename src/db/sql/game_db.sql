-- 유저(Player)의 캐릭터 특성 
CREATE TABLE IF NOT EXISTS user_stat (
    class INT PRIMARY KEY,
    maxHp INT,
    maxMp INT,
    atk INT,
    def INT,
    magic INT,
    speed INT,
)

INSERT INTO user_stat (
    class, maxHp, maxMp, atk, def, magic, speed
    ) VALUES
(1001, 320, 75, 60, 10, 40, 3) --Cerberus
(1002, 320, 75, 60, 10, 40, 3) --Pegasus
(1003, 320, 75, 60, 10, 40, 3) --Phoenix
(1004, 320, 75, 60, 10, 40, 3) --Chinese Dragon
(1005, 320, 75, 60, 10, 40, 3) --Kitsune
(1006, 320, 75, 60, 10, 40, 3) --Leviathan
(1007, 320, 75, 60, 10, 40, 3) --Wyvern
(1008, 320, 75, 60, 10, 40, 3) --Dragon
(1009, 320, 75, 60, 10, 40, 3) --Kirin




-- 몬스터의 특성
CREATE TABLE IF NOT EXISTS monster_stat (
    monsterIdx INT PRIMARY KEY,
    monsterModel INT,
    monsterName VARCHAR(255),
    monsterHp INT,
    monsterAttack INT,
    monsterDeffence INT,
)

INSERT INTO monster_stat (
    monsterIdx, monsterModel, monsterName, monsterHp, monsterAttack, monsterDeffence
    ) VALUES
(0, 2001, '초급 일반 1', 50, 7, 5),
(1, 2002, '초급 일반 2', 60, 6, 10),
(2, 2003, '초급 일반 3', 70, 6, 8),
(3, 2004, '초급 일반 4', 90, 5, 5),
(4, 2005, '초급 일반 5', 80, 4, 4),
(5, 2006, '초급 일반 6', 60, 6, 20),
(6, 2007, '초급 일반 7', 70, 5, 18),
(7, 2008, '초급 일반 8', 80, 4, 22),
(8, 2009, '고급 일반 1', 75, 7, 20),
(9, 2010, '고급 일반 2', 90, 6, 25),
(10, 2011, '고급 일반 3', 100, 8, 18),
(11, 2012, '고급 일반 4', 90, 7, 22),
(12, 2013, '고급 일반 5', 60, 10, 20),
(13, 2014, '고급 일반 6', 80, 6, 25),
(14, 2015, '고급 일반 7', 80, 7, 22),
(15, 2016, '고급 일반 8', 10, 3, 28),
(16, 2017, '초급 보스 1', 50, 10, 25),
(17, 2018, '초급 보스 2', 75, 4, 30),
(18, 2019, '초급 보스 3', 120, 15, 35),
(19, 2020, '초급 보스 4', 90, 13, 100),
(20, 2021, '초급 보스 5', 60, 15, 100),
(21, 2022, '초급 보스 6', 110, 13, 100),
(22, 2023, '고급 보스 1', 120, 11, 100),
(23, 2024, '고급 보스 2', 140, 20, 100),
(24, 2025, '고급 보스 3', 90, 15, 100),
(25, 2026, '고급 보스 4', 130, 17, 100),
(26, 2027, '고급 보스 5', 140, 20, 100),
(27, 2028, '고급 보스 6', 110, 19, 100),
(28, 2029, '최종 보스', 550, 70, 250);




-- 던전 맵 코드
CREATE TABLE IF NOT EXISTS map_code (
    mapCode INT,
)

INSERT INTO map_code (mapCode) VALUES
(5001),
(5002),
(5003),
(5004),
(5005),
(5006),
(5007),




-- textInfo
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
    screenColor_b INT,
)

INSERT INTO text_info (
    name, version, msg, typingAnimation, 
    alignment_x, alignment_y, 
    textColor_r, textColor_g, textColor_b, 
    screenColor_r, screenColor_g, screenColor_b
    ) VALUES
("textInfo", "1.0.0", "던전에 오신걸 환영합니다.", false),
