import { BattleLog } from '../../../classes/models/battle/battleInfo/battleLog.class.js';
import { MonsterAction } from '../../../classes/models/battle/battleInfo/monsterAction.class.js';
import { PlayerAction } from '../../../classes/models/battle/battleInfo/playerAction.class.js';
import { SetMonsterHp } from '../../../classes/models/battle/battleInfo/setMonsterHp.class.js';
import { SetPlayerHp } from '../../../classes/models/battle/battleInfo/setPlayerHp.class.js';
import { getGameAssets } from '../../../init/assets.js';
import {
  createDungeonSession,
  getDungeonSession,
  leaveDungeonSession,
  nextDungeonSession,
} from '../../../session/dungeon.session.js';
import { v4 as uuidv4 } from 'uuid';
import { createResponse } from '../../../utils/response/createResponse.js';
import { dungeonSessions } from '../../../session/sessions.js';

const responseCodeHandler = ({ socket, payload }) => {
  const { responseCode } = payload;
  const dungeonSession = getDungeonSession(socket);
  const player = dungeonSession.users.find((user) => user.socket === socket);
  const monsters = dungeonSession.dungeonInfo.monsters;

  // 모든 몬스터가 사망했는지 확인
  const allMonstersDead = monsters.every((monster) => monster.isDead);

  // 플레이어 사망시 로그
  if (player.isDead) {
    if (responseCode === 1) {
      // 던전 나가기
      player.AlivePlayer();
      leaveDungeonSession(socket);
      const leaveDungeonResponse = createResponse('responseBattle', 'S_Leave_Dungeon');
      socket.write(leaveDungeonResponse);
    }
    return;
  }

  // 몬스터 모두 사망시 로그
  if (allMonstersDead) {
    if (responseCode === 1) {
      // 던전 진행
      const dungeon = nextDungeonSession(socket, player).buildDungeonInfo();
      const nextDungeonResponse = createResponse('responseTown', 'S_Enter_Dungeon', dungeon);
      socket.write(nextDungeonResponse);
    } else if (responseCode === 2) {
      // 던전 나가기
      leaveDungeonSession(socket);
      const leaveDungeonResponse = createResponse('responseBattle', 'S_Leave_Dungeon');
      socket.write(leaveDungeonResponse);
    }
    return;
  }

  // 기존 로직
  if (responseCode === 0) {
    screenDoneHandler({ socket, payload });
  } else {
    buttonActionHandler({ socket, payload });
  }
};

const screenDoneHandler = ({ socket, payload }) => {
  const screenDoneResponse = createResponse('responseBattle', 'S_Screen_Done');
  socket.write(screenDoneResponse);
};

const buttonActionHandler = ({ socket, payload }) => {
  const dungeonSession = getDungeonSession(socket);
  const gameAssets = getGameAssets();
  const user = dungeonSession.users.find((user) => user.socket === socket);
  const monsters = dungeonSession.dungeonInfo.monsters; // 몬스터 목록

  // 몬스터 hp
  let monsterHp = monsters[payload.responseCode - 1].monsterHp;
  // 플레이어 hp
  let playerHp = dungeonSession.player.playerCurHp;
  // 몬스터 공격력
  let monsterAtk = 20;
  // 플레이어 공격력
  let playerAtk = user.statInfo.atk + 100;
  let monsterDeath; // 몬스터 사망 시 액션
  let playerDeath; // 플레이어 사망 시 액션
  const battleLog1 = new BattleLog(gameAssets.battleLog1);

  let targetMonsterIdx;
  if (payload.responseCode === 1) {
    targetMonsterIdx = 0;
  } else if (payload.responseCode === 2) {
    targetMonsterIdx = 1;
  } else if (payload.responseCode === 3) {
    targetMonsterIdx = 2;
  }

  const playerAction = new PlayerAction(targetMonsterIdx, 0, 3001);

  monsterHp -= playerAtk;
  monsters[payload.responseCode - 1].monsterHp = monsterHp;

  const setMonsterHp = new SetMonsterHp(targetMonsterIdx, monsterHp);

  if (monsterHp <= 0) {
    // 공격한 몬스터가 사망 시
    monsters[targetMonsterIdx].DeadMonster();
    monsterDeath = new MonsterAction(targetMonsterIdx, 4);
  }

  const battleLog2 = new BattleLog(gameAssets.battleLog2);

  const monsterActions = []; // 몬스터의 행동을 저장할 배열
  for (let i = 0; i < monsters.length; i++) {
    const monster = monsters[i];

    // 몬스터가 사망했는지 확인
    if (monster.isDead) {
      continue; // 사망한 몬스터는 건너뜁니다.
    }

    // 몬스터가 공격할 때의 액션 생성
    const monsterAction = new MonsterAction(monster.monsterIdx, 0, 3002);

    playerHp -= monsterAtk;
    dungeonSession.player.playerCurHp = playerHp;

    const setPlayerHp = new SetPlayerHp(playerHp);

    monsterActions.push(
      { type: 'S_Monster_Action', data: monsterAction },
      { type: 'S_Set_Player_Hp', data: setPlayerHp },
    );

    if (playerHp <= 0) {
      // 공격당한 플레이어가 사망 시
      user.DeadPlayer();
      playerDeath = new PlayerAction(null, 1);
      break;
    }
  }

  const battleLog3 = new BattleLog(gameAssets.battleLog3);
  // 사망한 몬스터 버튼 비활성화
  monsters.forEach((monster) => {
    if (monster.isDead) {
      const monsterBtn = battleLog3.btns.find(
        (btn) => btn.msg === `${monster.monsterIdx + 1}번 몬스터`,
      );
      if (monsterBtn) {
        monsterBtn.enable = false;
      }
    }
  });

  const allMonstersDead = monsters.every((monster) => monster.isDead);

  const responses = [
    { type: 'S_Battle_Log', data: { battleLog: battleLog1 } },
    { type: 'S_Player_Action', data: playerAction },
    { type: 'S_Set_Monster_Hp', data: setMonsterHp },
    { type: 'S_Battle_Log', data: { battleLog: battleLog2 } },
    ...monsterActions,
    { type: 'S_Battle_Log', data: { battleLog: battleLog3 } },
  ];

  if (playerDeath) {
    // 플레이어 사망시 추가
    responses.pop();

    const battleLog5 = new BattleLog(gameAssets.battleLog5);

    responses.push(
      { type: 'S_Player_Action', data: playerDeath },
      { type: 'S_Battle_Log', data: { battleLog: battleLog5 } },
    );
  }

  if (monsterDeath) {
    // 몬스터 사망시 추가
    responses.splice(3, 0, { type: 'S_Monster_Action', data: monsterDeath });
    // 모든 몬스터 사망
    if (allMonstersDead) {
      responses.splice(4);

      const battleLog4 = new BattleLog(gameAssets.battleLog4);

      const stageClearLog = { type: 'S_Battle_Log', data: { battleLog: battleLog4 } };
      responses.push(stageClearLog);
    }
  }

  let index = 0;

  function sendResponse() {
    if (index < responses.length) {
      const { type, data } = responses[index];

      let delay = 2000; // 기본 딜레이

      if (index < responses.length - 1) {
        const nextType = responses[index + 1].type;

        // 현재 응답이 액션이고 다음 응답이 set HP인 경우 delay 500ms
        if (type.includes('Action') && nextType.includes('Hp')) {
          delay = 500;
        }

        // 현재 응답이 몬스터 액션이고 다음 응답이 배틀 로그인 경우 delay 3000ms
        if (type.includes('Monster') && nextType.includes('Battle')) {
          delay = 3000;
        }

        // 현재 응답이 'Set Monster Hp'이고 다음 응답이 'Monster Action'인 경우 delay 500ms
        if (type.includes('Set_Monster_Hp') && nextType.includes('Monster_Action')) {
          delay = 100;
        }

        // 현재 응답이 'Set Player Hp'이고 다음 응답이 'Player Action'인 경우 delay 500ms
        if (type.includes('Set_Player_Hp') && nextType.includes('Player_Action')) {
          delay = 100;
        }
      }

      socket.write(createResponse('responseBattle', type, data));
      index++;

      console.log(type);
      console.log(delay);

      setTimeout(sendResponse, delay);
    }
  }

  sendResponse();
};

export { screenDoneHandler, buttonActionHandler, responseCodeHandler };
