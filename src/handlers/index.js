import { HANDLER_IDS } from '../constants/handlerIds.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import enterTownHandler from './game/town/enterTownHandler.js';
import { avatarMoveHandler, avatarAnimationHandler } from './game/town/avatarHandler.js';
import chatHandler from './game/chatHandler.js';

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
