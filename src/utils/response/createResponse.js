import { getProtoMessages } from '../../init/loadProtos.js';
// import { getNextSequence } from '../../session/user.session.js';
import { config } from '../../config/config.js';
import { PACKET_TYPE } from '../../constants/header.js';

export const createResponse = ( responseCode, data = null) => {
  const protoMessages = getProtoMessages();
  let Response;

  try {
    switch (responseCode) {
      case 'S_Enter':
        Response = protoMessages.response.S_Enter;
        break;
      case 'S_Spawn':
        Response = protoMessages.response.S_Spawn;
        break;
      case 'S_Chat':
        Response = protoMessages.response.S_Chat;
        break;
      case 'S_Move':
        Response = protoMessages.response.S_Move;
        break;
      case 'S_Animation':
        Response = protoMessages.response.S_Animation;
        break;
    }
  } catch (err) {
    handleError(err);
  }

  const responsePayload = {
    data: data ? Buffer.from(JSON.stringify(data)) : null,
  };

  const buffer = Response.encode(responsePayload).finish();

  // 패킷 길이 정보를 포함한 버퍼 생성
  const packetLength = Buffer.alloc(config.packet.totalLength);
  packetLength.writeUInt32BE(
    buffer.length + config.packet.typeLength + config.packet.totalLength,
    0,
  ); // 패킷 길이에 타입 바이트 포함

  // 패킷 타입 정보를 포함한 버퍼 생성
  const packetType = Buffer.alloc(config.packet.typeLength);
  packetType.writeUInt8(PACKET_TYPE.NORMAL, 0);

  // 길이 정보와 메시지를 함께 전송
  return Buffer.concat([packetLength, packetType, buffer]);
};