import { getGameAssets } from '../../../init/assets.js';
import Stage from './stage.class.js';
import { DungeonInfo, Monster } from './dungeonInfo.class.js';
import { ScreenText, TextAlignment, Color } from './screenText.class.js';
import { BattleLog, Btn } from './battleLog.class.js';

class Dungeon {
  // 던전 생성시 맵은 고정됨
  constructor(id, user, dungeonCode) {
    this.id = id;
    this.user = user;
    this.mapCode;                       // 맵 구별 값
    this.dungeonCode = dungeonCode;     // 던전 구분 (1 ~ 4)
    this.stages = [];                   // 스테이지 목록
    this.proceed = 0;                  // 던전 진행도 (인덱스 값: 0 ~ lastStage-1)
    this.lastStage = [5, 7, 9, 11];     // 스테이지 별 길이 차이 - 후위 던전일수록 길이 증가

    this.loadedAssets = getGameAssets();      // 데이터 준비
  }

  // 던전 초기화
  initDungeon() {
    this.mapCode = 5000 + Math.floor(Math.random() * 7);    // 맵 랜덤 설정 (5000~5006)
    this.lastStage = this.lastStage[this.dungeonCode - 1];   // dungeonCode가 1~4 이니 -1 하면 0~3으로 인덱스값과 같다.
    let count = 1;      // 스테이지 id 설정용 변수. 0은 포로토버프가 null로 인식하므로 1부터 1씩 증가한다.
    console.log('this.dungeonCode:', this.dungeonCode);

    // 스테이지 생성을 위한 데이터 (스테이지 개수만큼 필요)
    for (let i = 0; i < this.lastStage; i++) {
      let maxNumber;
      if (i+1 == this.lastStage) {
        maxNumber = 1;      // 마지막 스테이지는 보스 몬스터 (1)
      } else {
        maxNumber = Math.floor(Math.random() * 3) +1;      // 스테이지 당 최대 몬스터수 (0~2 +1 = 1~3)
      }
      
      // dungeonInfo 생성
      let monsters = [];      // 해당 스테이지 몬스터목록
      for (let j = 0; j < maxNumber; j++) {      // 스테이지당 1~3 마리의 몬스터 생성
        const monsterDatas = this.loadedAssets.dungeonInfo.monsters;
        const monsterIdx = Math.floor(Math.random() * 7);
        const monsterModel = 2000 + monsterIdx +1;          // (2001~2007)
        let monster_Name = '';
        if(i+1 == this.lastStage) { monster_Name = `[BOSS] ${monsterDatas[monsterIdx].monsterName}` }
        else { monster_Name = `${monsterDatas[monsterIdx].monsterName}` }
        const monsterName = monster_Name;
        const monsterHp = monsterDatas[monsterIdx].monsterHp;

        const tempInfo = { monsterIdx, monsterModel, monsterName, monsterHp };
        const monster = new Monster(tempInfo);
        monsters.push(monster);
      }
      const dungeonCode = this.mapCode;         // 생성자 안에서 this.변수 사용 불가능
      const dungeonInfo = new DungeonInfo({ dungeonCode, monsters });
      // console.log('생성된 dungeonInfo:', dungeonInfo);

      // screenText 생성
      let msg = `${this.user.nickname}, 던전${this.dungeonCode}-${count}스테이지 입장!`;
      const textAlignment = new TextAlignment({ x: 0, y: 0 });
      const textColor = new Color({ r: 255, g: 255, b: 255 });
      const screenColor = new Color({ r: 0, g: 0, b: 0 });
      const textInfo = { msg, typingAnimation: false, textAlignment, textColor, screenColor };
      const screenText = new ScreenText(textInfo);

      // battleLog 생성
      msg = '';         // screenText도 Button도 같은 이름의 요소 'msg'를 가지고 있음
      const typingAnimation = false;
      const btns = [];
      console.log('maxNumber:', maxNumber, ' monsters:', monsters);
      for (let k = 0; k < maxNumber; k++) {
        // 1번째 이름부터 Attack 버튼 생성
        const newBtn = new Btn(`Attack ${monsters[k].getName()}`, true);
        if(k == 1) { btns.unshift(newBtn); }
        else { btns.push(newBtn); }
      }
      const tempLog = { msg, typingAnimation, btns };
      const battleLog = new BattleLog(tempLog);

      // (전투) 스테이지 생성 (현재로써는 전투방만이 구현 되어있음)
      if (i + 1 == this.lastStage) {      // 마지막 방 (보스방) 일 경우 - 현재 구현중 임
        const bossStatMaker = 3;          // 보스몬스터에게 줄 보정 수치 (기본: x3) 정확한 수치는 미정
        console.log('last_stage monster:', dungeonInfo.monsters[0]);
        dungeonInfo.monsters[0].setBossStat(bossStatMaker);
      }

      // 스테이지 생성 (count는 0부터 1씩 증가한다.)
      const stage = new Stage(count++, dungeonInfo, this.user, screenText, battleLog);
      this.stages.push(stage);
    }

  }

  // 현재 스테이지 반환
  getStageNow() {
    console.log('this.proceed:', this.proceed);
    return this.stages[this.proceed];   // 현재 진행도의 스테이지 반환 | 인덱스값: 0 ~ lastStage-1
  }
  // 다음 스테이지 반환
  getNextStage() {
    if (this.proceed <= this.lastStage) {
      const proceedNow = this.proceed;
      console.log('proceedNow:', proceedNow);
      console.log('proceedNext:', proceedNow+1);

      this.proceed += 1;
      return this.stages[this.proceed];    // 해당 진행도의 스테이지 반환 | 다음 스테이지를 적용하므로 진행도도 변경
    }
    else { return -1; }         // 최종 스테이지 클리어시 -1 반환 : EOF 표현의도
  }
  // 스테이지 진행도 반환
  getProceed() {
    return this.proceed;     // 현재 진행도
  }
  // 마지막 스테이지 번호 반환
  getLastStage() {
    return this.lastStage;     // 최종 스테이지 값 (5,7,9,11)
  }

  setBossStage(dungeonInfo, screenText, battleLog) {

    const stage = new Stage(this.id, dungeonInfo, this.user, screenText, battleLog);
    this.stages.push(stage);

    return stage;
  }

  addUser(user) {
    this.user = user;
  }
  getUser() {
    return this.user;     // 유저 정보 반환
  }

}

export default Dungeon;