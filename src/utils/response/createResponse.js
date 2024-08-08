import { getProtoMessages } from '../../init/loadProtos.js';
// import { getNextSequence } from '../../session/user.session.js';
import { config } from '../../config/config.js';
import { PACKET_TYPE } from '../../constants/header.js';
import CustomError from './../error/customError.js';
import { ErrorCodes } from '../error/errorCodes.js';

export const createResponse = (packageType, packetId, data = null) => {
  const protoMessages = getProtoMessages();
  const Response = protoMessages[packageType][packetId];
  const buffer = Response.encode(data).finish();

  const packetLength = Buffer.alloc(config.packet.totalLength);
  console.log('packetId:', packetId);
  console.log('packetLength_before:', packetLength);
  packetLength.writeUInt32BE(
    buffer.length + config.packet.typeLength + config.packet.totalLength,
    0,
  );
  console.log('packetLength_after:', packetLength);

  const packetType = Buffer.alloc(config.packet.typeLength);

  const packetCode = PACKET_TYPE[packetId.toUpperCase()];

  if (!packetCode) {
    throw new CustomError(
      ErrorCodes.PACKET_ID_NOT_FOUND,
      '리스폰스 생성 중, packetId 참조에 실패했습니다',
    );
  }

  packetType.writeUInt8(packetCode, 0); // 요기에서 packetType 1 을 받아야함

  console.log('packetType:', packetType);
  console.log('buffer:', buffer);

  // 길이 정보와 메시지를 함께 전송
  return Buffer.concat([packetLength, packetType, buffer]);
};
