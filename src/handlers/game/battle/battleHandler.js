import { getDungeonSession } from '../../../session/dungeon.session.js';
import { createResponse } from '../../../utils/response/createResponse.js';

const responseCodeHandler = ({ socket, payload }) => {
  const { responseCode } = payload;
  if (responseCode === 0) {
    screenDoneHandler({ socket, payload });
  } else {
    playerActionHandler({ socket, payload });
  }
};

const screenDoneHandler = ({ socket, payload }) => {
  const screenDoneResponse = createResponse('responseBattle', 'S_Screen_Done');
  socket.write(screenDoneResponse);
};

let monsterHp = 150;
let playerHp = 100;
const playerActionHandler = ({ socket, payload }) => {
  const dungeonSession = getDungeonSession();
  console.log(dungeonSession);

  const battleLog1 = {
    battleLog: {
      msg: '플레이어 공격 턴',
      typingAnimation: false,
      btns: [
        {
          msg: '1번 몬스터',
          enable: false,
        },
        {
          msg: '2번 몬스터',
          enable: false,
        },
      ],
    },
  };

  let targetMonsterIdx;
  if (payload.responseCode === 1) {
    targetMonsterIdx = 0;
  } else if (payload.responseCode === 2) {
    targetMonsterIdx = 1;
  } else if (payload.responseCode === 3) {
    targetMonsterIdx = 2;
  }

  const playerAction = {
    targetMonsterIdx: targetMonsterIdx,
    actionSet: {
      animCode: 0,
      effectCode: 3001,
    },
  };

  monsterHp -= 50;
  const setMonsterHp = {
    monsterIdx: 0,
    hp: monsterHp,
  };

  const battleLog2 = {
    battleLog: {
      msg: '몬스터 공격 턴',
      typingAnimation: false,
      btns: [
        {
          msg: '1번 몬스터',
          enable: false,
        },
        {
          msg: '2번 몬스터',
          enable: false,
        },
      ],
    },
  };

  const monsterAction = {
    actionMonsterIdx: 0,
    actionSet: {
      animCode: 0,
      effectCode: 3002,
    },
  };

  playerHp -= 20;
  const setPlayerHp = {
    hp: playerHp,
  };

  const battleLog3 = {
    battleLog: {
      msg: '공격할 몬스터를 선택해주세요',
      typingAnimation: false,
      btns: [
        {
          msg: '1번 몬스터',
          enable: true,
        },
        {
          msg: '2번 몬스터',
          enable: true,
        },
      ],
    },
  };

  const responses = [
    createResponse('responseBattle', 'S_Battle_Log', battleLog1),
    createResponse('responseBattle', 'S_Player_Action', playerAction),
    createResponse('responseBattle', 'S_Set_Monster_Hp', setMonsterHp),
    createResponse('responseBattle', 'S_Battle_Log', battleLog2),
    createResponse('responseBattle', 'S_Monster_Action', monsterAction),
    createResponse('responseBattle', 'S_Set_Player_Hp', setPlayerHp),
    createResponse('responseBattle', 'S_Battle_Log', battleLog3),
  ];

  let index = 0;

  function sendResponse() {
    if (index < responses.length) {
      socket.write(responses[index]);
      index++;

      let delay = 500;

      if (index === 4) {
        delay = 3000;
      }

      setTimeout(sendResponse, delay);
    }
  }

  sendResponse();
};

export { screenDoneHandler, playerActionHandler, responseCodeHandler };
