export const SQL_QUERIES = {
  FIND_USER_BY_NICKNAME: 'SELECT * FROM user WHERE nickname = ?',
  ADD_USER: 'INSERT INTO user (nickname, userClass, userLevel) VALUES (?, ?, ?)',
  UPDATE_USER_LOGIN: 'UPDATE user SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
};
