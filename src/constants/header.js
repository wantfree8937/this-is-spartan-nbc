export const TOTAL_LENGTH = 4; // 전체 길이를 나타내는 4바이트
export const PACKET_TYPE_LENGTH = 1; // 패킷타입을 나타내는 1바이트 // 0 = 핑, 1 = 일반 패킷

export const PACKET_TYPE = {
  S_ENTER : 1,
  S_SPAWN : 2,
  S_DESPAWN : 5,
  S_MOVE : 7,
  S_ANIMATION : 9,
  S_CHANGE_COSTUME : 11,
  S_CHAT : 13,
  S_ENTER_DUNGEON : 16,
  S_LEAVE_DUNGEON : 17,
  S_SCREEN_TEXT : 18,
  S_SCREEN_DONE : 19,
  S_BATTLE_LOG : 20,
  S_SET_PLAYER_HP : 21,
  S_SET_PLAYER_MP : 22,
  S_SET_MONSTER_HP : 23,
  S_PLAYER_ACTION : 24,
  S_MONSTER_ACTION : 25
};