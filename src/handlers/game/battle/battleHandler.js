import { BattleLog } from '../../../classes/models/battle/battleInfo/battleLog.class.js';
import { MonsterAction } from '../../../classes/models/battle/battleInfo/monsterAction.class.js';
import { PlayerAction } from '../../../classes/models/battle/battleInfo/playerAction.class.js';
import { SetMonsterHp } from '../../../classes/models/battle/battleInfo/setMonsterHp.class.js';
import { SetPlayerHp } from '../../../classes/models/battle/battleInfo/setPlayerHp.class.js';
import { getGameAssets } from '../../../init/assets.js';
import { getDungeonSession, nextDungeonSession } from '../../../session/dungeon.session.js';
import { createResponse } from '../../../utils/response/createResponse.js';

const responseCodeHandler = ({ socket, payload }) => {
  const { responseCode } = payload;
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
  let delay = 500; // socket.write 딜레이 설정

  // 몬스터 hp
  let monsterHp = monsters[payload.responseCode - 1].monsterHp;
  // 플레이어 hp
  let playerHp = dungeonSession.player.playerCurHp;
  // 몬스터 공격력
  let monsterAtk = 20;
  // 플레이어 공격력
  let playerAtk = user.statInfo.atk + 100;
  let monsterDeath; // 몬스터 사망 시 액션
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
  if (monsterHp <= 0) {
    // 공격한 몬스터가 사망 시
    monsters[targetMonsterIdx].DeadMonster();
    monsterDeath = new MonsterAction(targetMonsterIdx, 4);
  }

  const setMonsterHp = new SetMonsterHp(targetMonsterIdx, monsterHp);

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
      createResponse('responseBattle', 'S_Monster_Action', monsterAction),
      createResponse('responseBattle', 'S_Set_Player_Hp', setPlayerHp),
    );
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
    createResponse('responseBattle', 'S_Battle_Log', { battleLog: battleLog1 }),
    createResponse('responseBattle', 'S_Player_Action', playerAction),
    createResponse('responseBattle', 'S_Set_Monster_Hp', setMonsterHp),
    createResponse('responseBattle', 'S_Battle_Log', { battleLog: battleLog2 }),
    ...monsterActions,
    createResponse('responseBattle', 'S_Battle_Log', { battleLog: battleLog3 }),
  ];

  if (monsterDeath) {
    // 몬스터 사망시 추가
    responses.splice(2, 0, createResponse('responseBattle', 'S_Monster_Action', monsterDeath));
    // 모든 몬스터 사망
    if (allMonstersDead) {
      responses.splice(3);

      const nextStage = nextDungeonSession(socket, user);
      const dungeon = nextStage.buildDungeonInfo();

      const enterDungeonResponse = createResponse('responseTown', 'S_Enter_Dungeon', dungeon);
      responses.push(enterDungeonResponse);
    }
  }

  let index = 0;

  function sendResponse() {
    if (index < responses.length) {
      socket.write(responses[index]);
      index++;

      setTimeout(sendResponse, delay);
    }
  }

  sendResponse();
};

export { screenDoneHandler, buttonActionHandler, responseCodeHandler };
