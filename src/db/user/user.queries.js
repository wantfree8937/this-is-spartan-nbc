export const SQL_QUERIES = {
  FIND_USER_BY_NICKNAME: 'SELECT * FROM user WHERE nickname = ?',
  ADD_USER: 'INSERT INTO user (nickname) VALUES (?)',
  ADD_CHARACTER_CLASS:
    'INSERT INTO user_character (uuid, playerId, character_class) VALUES (?, ?, ?)',
  UPDATE_USER_LOGIN: 'UPDATE user SET last_login = CURRENT_TIMESTAMP WHERE playerId = ?',
  GET_CHARACTER_CLASS_BY_IDS:
    'SELECT * FROM user_character WHERE playerId = ? AND character_class = ?',
};
