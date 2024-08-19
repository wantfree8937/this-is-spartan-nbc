import { getGameAssets } from '../../../init/assets.js';
import Stage from './stage.class.js';
import { DungeonInfo, Monster } from './dungeonInfo.class.js';
import { ScreenText, TextAlignment, Color } from './screenText.class.js';
import { BattleLog, Btn } from './battleLog.class.js';

class Dungeon {
  // 던전 생성시 맵은 고정됨
  constructor(id, user, dungeonCode, monsters) {
    this.id = id;
    this.user = user;
    this.mapCode; // 맵 구별 값
    this.dungeonCode = dungeonCode; // 던전 구분 (1 ~ 4)
    this.stages = []; // 스테이지 목록
    this.proceed = 0; // 던전 진행도 (인덱스 값: 0 ~ lastStage-1)
    this.lastStage = [4, 5, 6, 7]; // 스테이지 별 길이 차이 - 후위 던전일수록 길이 증가

    this.loadedAssets = getGameAssets(); // 데이터 준비
    this.monsters = monsters;
  }

  // 던전 초기화 (맵, 스테이지길이)
  initDungeon() {
    this.mapCode = 5000 + Math.floor(Math.random() * 7); // 맵 랜덤 설정 (5000~5006)
    this.lastStage = this.lastStage[this.dungeonCode - 1]; // dungeonCode가 1~4 이니 -1 하면 0~3으로 인덱스값과 같다.
  }
  // 스테이지 생성
  initStage(user) {
    this.user; // 유저(플레이어) 정보갱신

    // 최대 몬스터수 지정 (1~3)
    let maxNumber;
    if (this.proceed + 1 == this.lastStage) {
      maxNumber = 1;
    } // 마지막 스테이지는 보스 몬스터 (1개체 / 변경가능)
    else {
      maxNumber = Math.floor(Math.random() * 3) + 1;
    }

    // dungeonInfo 생성
    const dungeonCode = this.mapCode; // 던전 맵 코드

    let monsters = []; // 해당 스테이지 몬스터목록
    for (let j = 0; j < maxNumber; j++) {
      // 스테이지당 1~3 마리의 몬스터 생성
      const monsterDatas = this.loadedAssets.dungeonInfo.monsters; // 몬스터스텟 정보

      // 몬스터 생성
      let monsterIdx = -1;
      let monsterModel = -1;
      if (this.proceed + 1 == this.lastStage) {
        if (this.dungeonCode <= 2) {
          monsterIdx = Math.floor(Math.random() * 6) + 16;
        } // 1,2 던전은 초급보스 지정 | (16~21)
        else if (this.dungeonCode >= 3) {
          monsterIdx = Math.floor(Math.random() * 6) + 22;
        } // 3,4 던전은 고급보스 지정 | (22~27)

        if (this.dungeonCode <= 2) {
          monsterModel = 2000 + monsterIdx;
        } // 1,2 던전은 초급보스 이미지 | (2016~2021)
        else if (this.dungeonCode >= 3) {
          monsterModel = 2000 + monsterIdx;
        } // 3,4 던전은 고급보스 이미지 | (2022~2027)
      } else {
        if (this.dungeonCode <= 2) {
          monsterIdx = Math.floor(Math.random() * 8);
        } // 1,2 던전은 초급 일반몹 지정 | (0~7)
        else if (this.dungeonCode >= 3) {
          monsterIdx = Math.floor(Math.random() * 8) + 8;
        } // 3,4 던전은 고급 일반몹 지정 | (8~15)

        if (this.dungeonCode <= 2) {
          monsterModel = 2001 + monsterIdx;
        } // 1,2 던전은 초급 일반몹 이미지 | (2001~2007)
        else if (this.dungeonCode >= 3) {
          monsterModel = 2001 + monsterIdx;
        } // 3,4 던전은 고급 일반몹 이미지 | (2008~2015)
      }

      let monster_Name = '';
      if (this.proceed + 1 == this.lastStage) {
        monster_Name = `[BOSS] ${monsterDatas[monsterIdx].monsterName}`;
      } else {
        monster_Name = `${monsterDatas[monsterIdx].monsterName}`;
      }
      const monsterName = monster_Name;
      const monsterHp = monsterDatas[monsterIdx].monsterHp;

      const tempInfo = { monsterIdx, monsterModel, monsterName, monsterHp };
      const monster = new Monster(tempInfo);
      monsters.push(monster);
    }
    const dungeonInfo = new DungeonInfo({ dungeonCode, monsters }); // 생성자 안에서 this.변수 사용 불가능

    // screenText 생성
    let msg = '';
    if (this.proceed + 1 == this.lastStage) {
      msg = `${this.user.nickname}, 던전${this.dungeonCode} 보스스테이지 도달!`;
    } else {
      msg = `${this.user.nickname}, 던전${this.dungeonCode} ${this.proceed + 1}스테이지 도달!`;
    }
    const textAlignment = new TextAlignment({ x: 0, y: 0 });
    const textColor = new Color({ r: 255, g: 255, b: 255 });
    const screenColor = new Color({ r: 0, g: 0, b: 0 });
    const textInfo = { msg, typingAnimation: false, textAlignment, textColor, screenColor };
    const screenText = new ScreenText(textInfo);

    // battleLog 생성
    msg = ''; // screenText도 Button도 같은 이름의 요소 'msg'를 가지고 있음
    const typingAnimation = false;
    const btns = [];
    console.log('maxNumber:', maxNumber, ' monsters:', monsters);
    for (let k = 0; k < maxNumber; k++) {
      // 1번째 이름부터 Attack 버튼 생성
      const newBtn = new Btn(`Attack ${monsters[k].getName()}`, true);
      if (k == 1) {
        btns.unshift(newBtn);
      } else {
        btns.push(newBtn);
      }
    }
    const tempLog = { msg, typingAnimation, btns };
    const battleLog = new BattleLog(tempLog);

    // (전투) 스테이지 생성 (현재로써는 전투방만이 구현 되어있음)
    if (this.proceed + 1 == this.lastStage) {
      // 마지막 방 (보스방) 일 경우 - 현재 구현중 임
      const bossStatMaker = 3; // 보스몬스터에게 줄 보정 수치 (기본: x3) 정확한 수치는 미정
      console.log('last_stage monster:', dungeonInfo.monsters[0]);
      dungeonInfo.monsters[0].setBossStat(bossStatMaker);
    }

    // 스테이지 생성 (count는 0부터 1씩 증가한다.)
    let stageId = this.proceed + 1; // 스테이지 id 설정용 변수. 0은 포로토버프가 null로 인식하므로 1부터 1씩 증가한다.
    const stage = new Stage(stageId, dungeonInfo, this.user, screenText, battleLog);
    this.stages.push(stage);

    return stage;
  }

  // 현재 스테이지 반환
  getStageNow() {
    return this.stages[this.proceed]; // 현재 진행도의 스테이지 반환 | 인덱스값: 0 ~ lastStage-1
  }
  // 다음 스테이지 반환
  getNextStage() {
    if (this.proceed <= this.lastStage) {
      this.proceed += 1; // 다음 스테이지를 적용하므로 진행도 증가
      this.initStage(this.user); // 다음 스테이지 생성
      return this.stages[this.proceed]; // 생성된 스테이지 반환
    } else {
      return -1;
    } // 최종 스테이지 클리어시 -1 반환 : EOF 표현의도
  }
  // 스테이지 진행도 반환
  getProceed() {
    return this.proceed; // 현재 진행도
  }
  // 마지막 스테이지 번호 반환
  getLastStage() {
    return this.lastStage; // 최종 스테이지 값 (5,7,9,11)
  }

  addUser(user) {
    this.user = user;
  }
  getUser() {
    return this.user; // 유저 정보 반환
  }
}

export default Dungeon;
