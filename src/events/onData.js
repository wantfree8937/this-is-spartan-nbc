import { config } from '../config/config.js';
import { packetParser } from '../utils/parser/packetParser.js';
import { getHandlerById } from '../handlers/index.js';
import { handleError } from '../utils/error/errorHandler.js';

export const onData = (socket) => async (data) => {
  socket.buffer = Buffer.concat([socket.buffer, data]);
  const totalHeaderLength = config.packet.totalLength + config.packet.typeLength;

  while (socket.buffer.length >= totalHeaderLength) {
    const length = socket.buffer.readUInt32LE(0);
    console.log('length:', length);
    const packetId = socket.buffer.readUInt8(config.packet.totalLength);
    console.log('packetId:', packetId);

    if (socket.buffer.length >= length) {
      const packet = socket.buffer.slice(totalHeaderLength, length);
      console.log('packet:', packet);
      socket.buffer = socket.buffer.slice(length);

      try {
        const { payload } = packetParser(packet, packetId);

        packetId;
        const handler = getHandlerById(packetId);
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
