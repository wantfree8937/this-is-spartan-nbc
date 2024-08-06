import { getProtoMessages } from '../../init/loadProtos.js';
// import { getNextSequence } from '../../session/user.session.js';
import { config } from '../../config/config.js';
import { PACKET_TYPE } from '../../constants/header.js';

export const createResponse = (packageType, packetId, data = null) => {
  const protoMessages = getProtoMessages();
  const Response = protoMessages[packageType][packetId];

  const buffer = Response.encode(data).finish();

  const packetLength = Buffer.alloc(config.packet.totalLength);
  packetLength.writeUInt32BE(
    buffer.length + config.packet.typeLength + config.packet.totalLength,
    0,
  );

  console.log();
  const packetType = Buffer.alloc(config.packet.typeLength);

  packetType.writeUInt8(PACKET_TYPE[packetId.toUpperCase()], 0); // 요기에서 packetType 1 을 받아야함

  // 길이 정보와 메시지를 함께 전송
  return Buffer.concat([packetLength, packetType, buffer]);
};
