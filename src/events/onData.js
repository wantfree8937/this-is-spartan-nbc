import { config } from '../config/config.js';
import { PACKET_TYPE } from '../constants/header.js';
import { packetParser } from '../utils/parser/packetParser.js';
import { getHandlerById } from '../handlers/index.js';
import { getUserById, getUserBySocket } from '../session/user.session.js';
import { handleError } from '../utils/error/errorHandler.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import { getProtoMessages } from '../init/loadProtos.js';

export const onData = (socket) => async (data) => {
  socket.buffer = Buffer.concat([socket.buffer, data]);
  const totalHeaderLength = config.packet.totalLength + config.packet.typeLength;

  while (socket.buffer.length >= totalHeaderLength) {
    const length = socket.buffer.readUInt32LE(0);
    console.log(length);
    const handlerId = socket.buffer.readUInt8(config.packet.totalLength);

    if (socket.buffer.length >= length) {
      const packet = socket.buffer.slice(totalHeaderLength, length);
      console.log(packet);
      socket.buffer = socket.buffer.slice(length);

      try {
        const { payload } = packetParser(packet, handlerId);

        handlerId;
        const handler = getHandlerById(handlerId);
        await handler({
          socket,
          payload,
        });
      } catch (error) {
        handleError(socket, error);
      }
    } else {
      break;
    }
  }
};
