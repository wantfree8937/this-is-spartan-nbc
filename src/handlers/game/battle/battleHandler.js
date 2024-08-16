import { createResponse } from '../../../utils/response/createResponse.js';
import { getDungeonBySocket } from '../../../session/dungeon.session.js';
import { getGameAssets } from '../../../init/assets.js';
import { ActionSet } from '../../../classes/models/battle/actionSet.class.js';

export const screenDoneHandler = ({ socket, payload }) => {
  const screenDoneResponse = createResponse('responseBattle', 'S_Screen_Done');
  socket.write(screenDoneResponse);
};

export const selectCheckHandler = ({ socket, payload }) => {
  const assetsDatas = getGameAssets();

  // 클라이언트가 선택한 버튼 값 1~6 / 0은 버튼이 아님
  const { responseCode } = payload;
  console.log('responseCode:', responseCode);

  // 전투 상황처리를 위해 필요한 데이터들
  // 필요한 것1 : 현재 플레이중인 던전과 현재 진행중인 스테이지 정보
  // 필요한 것2 : 현재 스테이지의 플레이어와 몬스터들 정보
  // **던전 객체 하나면 가져오면 나머지 메서드들은 각 클래스(객체)에 들어있음**

  // 1. 던전세션 목록에서 본인이 플레이중인 던전 선택 | 결과: Dungeon 객체
  const dungeonNow = getDungeonBySocket(socket);
  // 2. 선택된 던전에서 현재 스테이지 정보 로드 | 결과: stage 객체
  const stageNow = dungeonNow.getStageNow();
  console.log('stageNow:', stageNow);
  // 3. 현재 스테이지의 플레이어 정보 로드 | 결과: Player 객체
  const playerNow = stageNow.getPlayer();
  // 4. 현재 스테이지의 몬스터(들) 정보 로드 | 결과: (Monster 객체들이 들어있는) monsters 배열
  const monstersNow = stageNow.getMonsters();

  // 플레이어 스텟 정보
  const playerStats = dungeonNow.getUser().getStatInfo();
  // 몬스터 스텟 정보
  const monsterStats = assetsDatas.dungeonInfo.monsters;
  // 배틀로그 정보
  let battleLog = stageNow.getBattleLog();

  // 진행순서 : 플레이어 공격모션 -> 몬스터 HP감소 처리 -> 몬스터 공격모션 -> 플레이어 HP감소
  // 일반공격과 특수공격(MP 사용) 구분 예정
  let msg = '';     // battleLog 메시지 갱신용 변수
  if (0 < responseCode && responseCode <= monstersNow.length) {
    console.log(`${responseCode}번 버튼을 선택함.`);      // 플레이어가 선택한 버튼 로그
    const attackTarget = responseCode - 1;         // 몬스터 인덱스와 responseCode의 값차이 == 1

    // 플레이어 공격처리 및 반영
    const targetMonsterIdx = responseCode;
    let actionSet = new ActionSet(0, 1);      // animCode(attack: 0), effectCode

    const playerAnimaion = createResponse('responseBattle', 'S_Player_Action', { targetMonsterIdx, actionSet });
    socket.write(playerAnimaion);

    // 몬스터 HP 체력감소 연산처리 및 반영
    monstersNow[attackTarget].damageMonsterHp(playerStats.atk);
    const monsterIdx = monstersNow[attackTarget].getIdx();
    const hp = monstersNow[attackTarget].getHp();

    const updateMonsterHp = createResponse('responseBattle', 'S_Set_Monster_Hp', { monsterIdx, hp });
    socket.write(updateMonsterHp);

    // 배틀로그 변경 및 반영
    msg = `플레이어가 ${monstersNow[attackTarget].getName()} 공격!`;
    battleLog.changeMsg(msg);
    if (hp <= 0) { battleLog.getBtns().disableBtn(); };      // 몬스터 사망시 버튼 비활성화
    let updateBatteLog = createResponse('responseBattle', 'S_Battle_Log', { battleLog });
    socket.write(updateBatteLog);

    // 스테이지의 모든 몬스터에 대하여 수행
    for (let i = 0; i < monstersNow.length; i++) {
      if (monstersNow[i].getHp() <= 0) {      // 몬스터 사망시 패스
        continue;
      } else {      // 살아있을시 공격
        // 몬스터 행동처리 및 반영
        const actionMonsterIdx = monstersNow[i].getIdx();
        actionSet = new ActionSet(Math.floor(Math.random() * 2), 3);      // animCode(attack: 0~1), effectCode

        const monsterAnimaion = createResponse('responseBattle', 'S_Monster_Action', { actionMonsterIdx, actionSet });
        socket.write(monsterAnimaion);

        // 플레이어 HP감소 처리 및 반영
        const damage = monsterStats[monstersNow[i].getIdx()].monsterAttack;
        playerNow.updatePlayerHp(-damage);

        const hp = playerNow.getHpNow();
        const updateplayerHp = createResponse('responseBattle', 'S_Set_Player_Hp', { hp });
        socket.write(updateplayerHp);

        // 배틀로그 변경 및 반영
        msg = `${monstersNow[i].getName()}가 플레이어 공격!`;
        battleLog.changeMsg(msg);
        let updateBatteLog = createResponse('responseBattle', 'S_Battle_Log', { battleLog });
        socket.write(updateBatteLog);
      }
    }

    // 플레이어 사망시 이벤트처리
    if(playerNow.getHpNow() <= 0) {
      battleLog.deleteBtns();
      let updateBatteLog = createResponse('responseBattle', 'S_Battle_Log', { battleLog });
      socket.write(updateBatteLog);
    }


  } else if (responseCode > monstersNow.length) {
    console.log(`${responseCode}번 버튼을 선택함.`);

  } else {
    console.log('버튼이 선택되지 않음.')
  }






  const resultResponse = createResponse('responseBattle', 'S_Screen_Done');
  socket.write(resultResponse);
};

export default { screenDoneHandler, selectCheckHandler };