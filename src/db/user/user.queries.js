export const SQL_QUERIES = {
  FIND_USER_BY_NICKNAME: 'SELECT * FROM user WHERE nickname = ?',
  ADD_USER: 'INSERT INTO user (nickname, password) VALUES (?, ?)',
  ADD_CHARACTER_CLASS:
    'INSERT INTO user_character (uuid, playerId, character_class) VALUES (?, ?, ?)',
  ADD_CHARACTER_UNLOCK: 'INSERT INTO user_unlock_characters (playerId) VALUES (?)',
  UPDATE_USER_LOGIN: 'UPDATE user SET last_login = CURRENT_TIMESTAMP WHERE playerId = ?',
  GET_CHARACTER_CLASS_BY_IDS:
    'SELECT * FROM user_character WHERE playerId = ? AND character_class = ?',
  GET_USER_UNLOCK: 'SELECT * FROM user_unlock_characters WHERE playerId = ?',
  UPDATE_UNLOCK_CHARACTER: (name) =>
    `UPDATE user_unlock_characters SET ${name} = TRUE WHERE playerId = ?`,
  UPDATE_LEVEL: 'UPDATE user_character SET level = ? where uuid = ?',
  UPDATE_COIN: 'UPDATE user SET coin = ? WHERE playerId = ?',
  UPDATE_SOUL: 'UPDATE user_character SET soul = ? WHERE uuid = ?',
  GET_SOUL_BY_UUID: 'SELECT soul FROM user_character WHERE uuid = ?',
  GET_LEVEL_BY_CLASS: 'SELECT level FROM user_character WHERE uuid = ?',
  GET_COIN_BY_PLAYER_ID: 'SELECT coin FROM user WHERE playerId = ?',
  GET_RITUAL_LEVEL: 'SELECT level FROM user_character WHERE playerId = ?',
  UPDATE_FINAL_CHECK: 'UPDATE user SET finalCheck = ? WHERE uuid = ?',
};