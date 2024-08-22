import { HANDLER_IDS } from '../constants/handlerIds.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import {
  enterTownHandler,
  enterDungeonHandler,
  loginHandler,
  registerHandler,
  unlockCharacterHandler,
  townSelectHandler,
  connectHandler,
  finalCheckHandler,
} from './game/town/enterHandler.js';
import { avatarMoveHandler, avatarAnimationHandler } from './game/town/avatarHandler.js';
import { characterUpgradeHandler, finalBossHandler } from './game/town/towerHandler.js';
import chatHandler from './game/chatHandler.js';
import { screenDoneHandler, selectCheckHandler } from './game/battle/battleHandler.js';

const handlers = {
  [HANDLER_IDS.C_ENTER]: {
    handler: enterTownHandler,
    protoType: 'town.C_Enter',
  },
  [HANDLER_IDS.C_MOVE]: {
    handler: avatarMoveHandler,
    protoType: 'town.C_Move',
  },
  [HANDLER_IDS.C_ANIMATION]: {
    handler: avatarAnimationHandler,
    protoType: 'town.C_Animation',
  },
  [HANDLER_IDS.C_CHAT]: {
    handler: chatHandler,
    protoType: 'chat.C_Chat',
  },
  [HANDLER_IDS.C_ENTER_DUNGEON]: {
    handler: enterDungeonHandler,
    protoType: 'town.C_Enter_Dungeon',
  },
  [HANDLER_IDS.C_PLAYER_RESPONSE]: {
    handler: selectCheckHandler,
    protoType: 'battle.C_Player_Response',
  },
  [HANDLER_IDS.C_LOGIN]: {
    handler: loginHandler,
    protoType: 'town.C_Login',
  },
  [HANDLER_IDS.C_UNLOCK_CHARACTER]: {
    handler: unlockCharacterHandler,
    protoType: 'town.C_Unlock_Character',
  },
  [HANDLER_IDS.C_PLAYER_UPGRADE]: {
    handler: characterUpgradeHandler,
    protoType: 'town.C_Player_Upgrade',
  },
  [HANDLER_IDS.C_ENTER_FINAL]: {
    handler: finalBossHandler,
    protoType: 'town.C_Enter_Final',
  },
  [HANDLER_IDS.C_TOWN_SELECT]: {
    handler: townSelectHandler,
    protoType: 'town.C_Town_Select',
  },
  [HANDLER_IDS.C_CONNECT]: {
    handler: connectHandler,
    protoType: 'town.C_Connect',
  },
  [HANDLER_IDS.C_REGISTER]: {
    handler: registerHandler,
    protoType: 'town.C_Register',
  },
  [HANDLER_IDS.C_FINAL_CHECK]: {
    handler: finalCheckHandler,
    protoType: 'town.C_FinalCheck',
  },

  // 다른 핸들러들을 추가
};

export const getHandlerById = (handlerId) => {
  if (!handlers[handlerId]) {
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `핸들러를 찾을 수 없습니다: ID ${handlerId}`,
    );
  }
  return handlers[handlerId].handler;
};

export const getProtoTypeNameByHandlerId = (handlerId) => {
  if (!handlers[handlerId]) {
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `아이디에 해당하는 프로토타입을 찾을 수 없습니다 Handler Id: ${handlerId}`,
    );
  }
  return handlers[handlerId].protoType;
};
