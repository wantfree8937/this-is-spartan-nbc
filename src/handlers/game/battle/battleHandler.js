import { createResponse } from '../../../utils/response/createResponse.js';
import { getDungeonBySocket, endSesssionById } from '../../../session/dungeon.session.js';
import { getGameAssets } from '../../../init/assets.js';
import { ActionSet } from '../../../classes/models/battle/actionSet.class.js';
import { enterNextStage } from '../town/enterHandler.js';

export const screenDoneHandler = ({ socket, payload }) => {
  const screenDoneResponse = createResponse('responseBattle', 'S_Screen_Done');
  socket.write(screenDoneResponse);
};

export const selectCheckHandler = async ({ socket, payload }) => {
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
  //console.log('stageNow:', stageNow);
  // 3. 현재 스테이지의 플레이어 정보 로드 | 결과: Player 객체
  const playerNow = stageNow.getPlayer();
  // 4. 현재 스테이지의 몬스터(들) 정보 로드 | 결과: (Monster 객체들이 들어있는) monsters 배열
  const monstersNow = stageNow.getMonsters();

  // 플레이어 스텟 정보
  const playerStats = dungeonNow.getUser().getStatInfo();
  // 몬스터 스텟 정보
  const monsterStats = assetsDatas.dungeonInfo.monsters;
  // 배틀로그 정보
  const battleLog = stageNow.getBattleLog();
  // 킬 카운트 (승리 판정)
  let killCount = 0;

  // 스테이지 종료시 (플레이어 사망 or 전투 승리)
  if (stageNow.getStageDone()) {
    if (responseCode == 1) {
      endSesssionById(dungeonNow.id);     // 던전세션 종료(삭제)
      const leaveDungeon = createResponse('responseBattle', 'S_Leave_Dungeon', null);
      socket.write(leaveDungeon);
    } else if (responseCode == 2) {
      const nextStage = dungeonNow.getNextStage();
      enterNextStage(socket, nextStage);
      return;
    }
  }

  // 진행순서 : 플레이어 공격모션 -> 몬스터 HP감소 처리 -> 몬스터 공격모션 -> 플레이어 HP감소
  // 일반공격과 특수공격(MP 사용) 구분 예정
  if (0 < responseCode && responseCode <= monstersNow.length) {
    console.log(`${responseCode}번 버튼을 선택함.`);      // 플레이어가 선택한 버튼 로그

    let attackTarget;
    if (monstersNow.length >= 2) {
      if (responseCode == 1) { attackTarget = 1; }
      else if (responseCode == 2) { attackTarget = 0; }
      else { attackTarget = 2; }
    } else {
      attackTarget = responseCode - 1;         // 몬스터 인덱스와 responseCode의 값차이 == 1
    }

    // 모든 이벤트 처리전까지 버튼 비활성화
    battleLog.disableBtns();
    let updateBatteLog = createResponse('responseBattle', 'S_Battle_Log', { battleLog });
    socket.write(updateBatteLog);

    // 플레이어 공격처리 및 반영
    const targetMonsterIdx = attackTarget;
    const actionSet = new ActionSet(0, 1);      // animCode(attack: 0), effectCode

    const playerAnimaion = createResponse('responseBattle', 'S_Player_Action', { targetMonsterIdx, actionSet });
    socket.write(playerAnimaion);
    await sleep(800);

    // 몬스터 HP 체력감소 연산처리 및 반영
    const monsterDataIdx = monstersNow[targetMonsterIdx].getIdx();
    const monsterDef = monsterStats[monsterDataIdx].monsterDefense;
    let resultDamage = playerStats.atk - monsterDef;
    if (resultDamage < 0) { resultDamage = 0; }
    monstersNow[attackTarget].damageMonsterHp(resultDamage);
    
    // 몬스터 사망시 이벤트처리
    if (monstersNow[attackTarget].getHp() < 0) {
      monstersNow[attackTarget].setHpZero();
      const actionMonsterIdx = attackTarget;
      const actionSet = new ActionSet(4, null);      // animCode(death: 4), effectCode
      const monsterAnimaion = createResponse('responseBattle', 'S_Monster_Action', { actionMonsterIdx, actionSet });
      socket.write(monsterAnimaion);
      await sleep(600);
    };
    const monsterIdx = targetMonsterIdx;
    const hp = monstersNow[attackTarget].getHp();

    const updateMonsterHp = createResponse('responseBattle', 'S_Set_Monster_Hp', { monsterIdx, hp });
    socket.write(updateMonsterHp);
    await sleep(300);

    // 배틀로그 변경 및 반영
    let msg = `플레이어가 ${monstersNow[attackTarget].getName()} 공격! ${resultDamage}의 데미지!`;
    battleLog.changeMsg(msg);
    updateBatteLog = createResponse('responseBattle', 'S_Battle_Log', { battleLog });
    socket.write(updateBatteLog);
    await sleep(700);

    console.log('monstersNow.length:', monstersNow.length);
    // 스테이지의 모든 몬스터에 대하여 수행
    for (let i = 0; i < monstersNow.length; i++) {
      if (monstersNow[i].getHp() <= 0) {      // 몬스터 사망시 패스
        
        killCount++; continue;
      } else {      // 살아있을시 공격
        // 몬스터 행동처리 및 반영
        const actionMonsterIdx = i;                 // 0 에서 최대 2
        const actionSet = new ActionSet(0, 3);      // animCode(attack: 0), effectCode

        const monsterAnimaion = createResponse('responseBattle', 'S_Monster_Action', { actionMonsterIdx, actionSet });
        socket.write(monsterAnimaion);
        await sleep(600);

        // 플레이어 HP감소 처리 및 반영
        const monsterIdx = monstersNow[i].getIdx();
        console.log('monsterIdx:', monsterIdx);
        const monsterAtk = monsterStats[monsterIdx].monsterAttack;
        let damageResult = monsterAtk - playerStats.def;
        if (damageResult < 0) { damageResult = 0; }
        playerNow.updatePlayerHp(-damageResult);

        const hp = playerNow.getHpNow();
        const updateplayerHp = createResponse('responseBattle', 'S_Set_Player_Hp', { hp });
        socket.write(updateplayerHp);
        await sleep(200);

        // 배틀로그 변경 및 반영
        const msg = `${monstersNow[i].getName()}가 플레이어 공격! ${damageResult}의 데미지!`;
        battleLog.changeMsg(msg);
        const updateBatteLog = createResponse('responseBattle', 'S_Battle_Log', { battleLog });
        socket.write(updateBatteLog);
        await sleep(700);
      }
    }

    // 행동 선택화면 구성
    for (let i = 0; i < monstersNow.length; i++) {
      let checker = -1;
      if (monstersNow.length >= 2) {
        if (i == 0) { checker = 1; }
        else if (i == 1) { checker = 0; }
        else { checker = 2; }
      } else {
        checker = i;         // 몬스터 인덱스와 responseCode의 값차이 == 1
      }
      if(monstersNow[i].getHp() > 0) { battleLog.btns[checker].enableBtn(); }
    }
    // 플레이어 행동 선택
    msg = `플레이어, 행동을 선택하세요.`;
    battleLog.changeMsg(msg);
    updateBatteLog = createResponse('responseBattle', 'S_Battle_Log', { battleLog });
    socket.write(updateBatteLog);
    await sleep(200);

    // 전투 승리시 이벤트처리
    if (killCount == monstersNow.length) {
      stageNow.makeDone();
      const msg = '전투 승리!';
      battleLog.changeMsg(msg);
      battleLog.deleteBtns();
      
      battleLog.addBtn('던전 나가기', true);
      if(dungeonNow.getProceed()+1 == dungeonNow.getLastStage()) {
        battleLog.addBtn('던전 클리어!', false);
      }else {
        battleLog.addBtn('다음 스테이지', true);
      }
      
      const winBatteLog = createResponse('responseBattle', 'S_Battle_Log', { battleLog });
      socket.write(winBatteLog);
      await sleep(200);
    }

    // 플레이어 사망시 이벤트처리
    if (playerNow.getHpNow() <= 0) {
      const targetMonsterIdx = 0;
      const actionSet = new ActionSet(1, null);      // animCode(death: 1), effectCode
      const playerAnimaion = createResponse('responseBattle', 'S_Player_Action', { targetMonsterIdx, actionSet });
      socket.write(playerAnimaion);
      await sleep(600);

      battleLog.deleteBtns();
      battleLog.addBtn('던전 나가기', true);
      const loseBatteLog = createResponse('responseBattle', 'S_Battle_Log', { battleLog });
      socket.write(loseBatteLog);
      await sleep(200);
    }

  } else if (responseCode > monstersNow.length) {
    console.log(`${responseCode}번 버튼을 선택함.`);

  } else {
    console.log('버튼이 선택되지 않음.')
    const resultResponse = createResponse('responseBattle', 'S_Screen_Done', {});
    socket.write(resultResponse);
    await sleep(200);
  }

};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default { screenDoneHandler, selectCheckHandler };