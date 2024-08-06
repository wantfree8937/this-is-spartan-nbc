import { HANDLER_IDS } from '../constants/handlerIds.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import enterTownHandler from './game/town/enterTownHandler.js';
import moveHandler from './game/town/moveHandler.js';

const handlers = {
  [HANDLER_IDS.C_ENTER]: {
    handler: enterTownHandler,
    protoType: 'town.C_Enter',
  },
  [HANDLER_IDS.C_MOVE]: {
    handler: moveHandler,
    protoType: 'town.C_Move',
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
