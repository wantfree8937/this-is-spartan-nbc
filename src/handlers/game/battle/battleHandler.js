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

  // 스테이지 진입시
  if (responseCode == 0) {
    const resultResponse = createResponse('responseBattle', 'S_Screen_Done', {});
    socket.write(resultResponse);
    await sleep(200); return;
  }

  // 전투 상황처리를 위해 필요한 데이터들
  // 필요한 것1 : 현재 플레이중인 던전과 현재 진행중인 스테이지 정보
  // 필요한 것2 : 현재 스테이지의 플레이어와 몬스터들 정보
  // **던전 객체 하나면 가져오면 나머지 메서드들은 각 클래스(객체)에 들어있음**

  // 1. 던전세션 목록에서 본인이 플레이중인 던전 선택 | 결과: Dungeon 객체
  const dungeonNow = getDungeonBySocket(socket);
  // 2. 선택된 던전에서 현재 스테이지 정보 로드 | 결과: stage 객체
  const stageNow = dungeonNow.getStageNow();
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
      endSesssionById(dungeonNow.getId());     // 던전세션 종료(삭제)
      const leaveDungeon = createResponse('responseBattle', 'S_Leave_Dungeon', null);
      socket.write(leaveDungeon);     // 던전 나가기
    } else if (responseCode == 2) {
      const nextStage = dungeonNow.getNextStage();      // 다음스테이지 로드
      enterNextStage(socket, nextStage);      // 다음스테이지 진입
      return;     // 현재 스테이지 종료
    }
  }

  // 진행순서 : 플레이어 공격모션 -> 몬스터 HP감소 처리 -> 몬스터 공격모션 -> 플레이어 HP감소
  // 특수공격(MP 사용) 기능 구현예정
  console.log(`${responseCode + 1}번 버튼을 선택함.`);      // 플레이어가 선택한 버튼 로그

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

  const targetMonsterIdx = attackTarget;

  let actionSet;
  let special = -1;     // if문 미동작시 에러발생 : -1
  // 일반공격(1~3) 선택시
  if (0 < responseCode && responseCode <= 3) {
    // 플레이어 공격처리 및 반영
    actionSet = new ActionSet(0, 3006);      // animCode(attack: 0), effectCode
    special = 0;
    await sleep(500);
  }
  // 특수공격(4~6) 선택시
  else if (3 < responseCode && responseCode <= 6) {
    // 플레이어 특수공격 처리 및 반영
    actionSet = new ActionSet(0, 3018);      // animCode(attack: 0), effectCode
    special = playerStats.magic;             // 추가 데미지 : 플레이어의 마법수치

    playerNow.updatePlayerMp(-10);           // 특수 공격시 MP소모 (수치 조정가능)
    const mp = playerNow.getMpNow();
    const updateplayerMp = createResponse('responseBattle', 'S_Set_Player_Mp', { mp });
    socket.write(updateplayerMp);
    await sleep(500);

  } else {      // responseCode 범위: 0~6 | 범위를 벗어나는 값이 전달되지 않아야 정상
    console.log('!!!ERROR!!! 있을수 없는 값 !!!ERROR!!!');

    let msg = `데이터 오류 발생! 클라이언트 재시작 필요.`;
    battleLog.changeMsg(msg);
    battleLog.deleteBtns();
    battleLog.addBtn('!! 에러 !!', false);
    updateBatteLog = createResponse('responseBattle', 'S_Battle_Log', { battleLog });
    socket.write(updateBatteLog);
    await sleep(200);

    return;
  }

  if (special < 0) {     // special 값으로 0 아래는 설정될 수 없음
    console.log('!!!ERROR!!! 있을수 없는 값 !!!ERROR!!!');

    let msg = `데이터 오류 발생! 클라이언트 재시작 필요.`;
    battleLog.changeMsg(msg);
    updateBatteLog = createResponse('responseBattle', 'S_Battle_Log', { battleLog });
    socket.write(updateBatteLog);
    await sleep(200);

    return;
  }

  // 몬스터 HP 체력감소 연산처리
  const monsterDataIdx = monstersNow[`${targetMonsterIdx}`].getIdx();
  const monsterDef = monsterStats[monsterDataIdx].monsterDeffence;
  let resultDamage = playerStats.atk + special - monsterDef;      // special = 일반 공격시 0, 특수 공격시 magic 값
  if (resultDamage < 0) { resultDamage = 0; }
  monstersNow[attackTarget].damageMonsterHp(resultDamage);

  // 플레이어 행동 반영
  const playerAnimaion = createResponse('responseBattle', 'S_Player_Action', { targetMonsterIdx, actionSet });
  socket.write(playerAnimaion);
  await sleep(600);

  // 몬스터 사망시 이벤트처리
  if (monstersNow[attackTarget].getHp() < 0) {
    monstersNow[attackTarget].setHpZero();
    const actionMonsterIdx = attackTarget;
    const actionSet = new ActionSet(4, null);      // animCode(death: 4), effectCode:none
    const monsterAnimaion = createResponse('responseBattle', 'S_Monster_Action', { actionMonsterIdx, actionSet });
    socket.write(monsterAnimaion);
    await sleep(600);
  };
  const monsterIdx = targetMonsterIdx;
  const hp = monstersNow[attackTarget].getHp();

  const updateMonsterHp = createResponse('responseBattle', 'S_Set_Monster_Hp', { monsterIdx, hp });
  socket.write(updateMonsterHp);
  await sleep(100);

  // 배틀로그 변경 및 반영
  let msg = `플레이어가 ${monstersNow[attackTarget].getName()} 공격! ${resultDamage}의 데미지!`;
  battleLog.changeMsg(msg);
  updateBatteLog = createResponse('responseBattle', 'S_Battle_Log', { battleLog });
  socket.write(updateBatteLog);
  await sleep(1000);

  // 스테이지의 모든 몬스터에 대하여 수행
  for (let i = 0; i < monstersNow.length; i++) {
    if (monstersNow[i].getHp() <= 0) {      // 몬스터 사망시 패스
      killCount++; continue;
    } else {      // 살아있을시 공격
      // 몬스터 행동처리 및 반영
      const actionMonsterIdx = i;                 // 0 에서 최대 2
      const actionSet = new ActionSet(0, 3004);      // animCode(attack: 0), effectCode

      const monsterAnimaion = createResponse('responseBattle', 'S_Monster_Action', { actionMonsterIdx, actionSet });
      socket.write(monsterAnimaion);
      await sleep(600);

      // 플레이어 HP감소 처리 및 반영
      const monsterIdx = monstersNow[i].getIdx();
      const monsterAtk = monsterStats[monsterIdx].monsterAttack;
      let damageResult = monsterAtk - playerStats.def;
      if (damageResult < 0) { damageResult = 0; }
      playerNow.updatePlayerHp(-damageResult);

      const hp = playerNow.getHpNow();
      const updateplayerHp = createResponse('responseBattle', 'S_Set_Player_Hp', { hp });
      socket.write(updateplayerHp);
      await sleep(100);

      // 배틀로그 변경 및 반영
      const msg = `${monstersNow[i].getName()}가 플레이어 공격! ${damageResult}의 데미지!`;
      battleLog.changeMsg(msg);
      const updateBatteLog = createResponse('responseBattle', 'S_Battle_Log', { battleLog });
      socket.write(updateBatteLog);
      await sleep(1000);

      // 플레이어 HP가 0 이하일 경우 전투종료
      if (playerNow.getHpNow() <= 0) break;
    }
  }

  // 플레이어 사망시 이벤트처리
  if (playerNow.getHpNow() <= 0) {
    stageNow.makeDone();
    const targetMonsterIdx = 0;
    const actionSet = new ActionSet(1, null);      // animCode(death: 1), effectCode:none
    const playerAnimaion = createResponse('responseBattle', 'S_Player_Action', { targetMonsterIdx, actionSet });
    socket.write(playerAnimaion);
    await sleep(600);

    battleLog.deleteBtns();
    battleLog.addBtn('던전 나가기', true);
    const loseBatteLog = createResponse('responseBattle', 'S_Battle_Log', { battleLog });
    socket.write(loseBatteLog);
    await sleep(200); return;
  }
  // 전투 승리시 이벤트처리
  else if (killCount == monstersNow.length) {
    stageNow.makeDone();
    const msg = '전투 승리!';
    battleLog.changeMsg(msg);
    battleLog.deleteBtns();

    battleLog.addBtn('던전 나가기', true);
    if (dungeonNow.getProceed() + 1 == dungeonNow.getLastStage()) {
      battleLog.addBtn('던전 클리어!', false);
    } else {
      battleLog.addBtn('다음 스테이지', true);
    }

    const winBatteLog = createResponse('responseBattle', 'S_Battle_Log', { battleLog });
    socket.write(winBatteLog);
    await sleep(200); return;
  }
  else {
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
      if (monstersNow[i].getHp() > 0) { battleLog.btns[checker].enableBtn(); }
    }
    // 플레이어 행동 선택
    msg = `플레이어, 행동을 선택하세요.`;
    battleLog.changeMsg(msg);
    updateBatteLog = createResponse('responseBattle', 'S_Battle_Log', { battleLog });
    socket.write(updateBatteLog);
    await sleep(200); return;
  }
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default { screenDoneHandler, selectCheckHandler };