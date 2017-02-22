'use strict';
/**
 * Created by gjrwcs on 2/22/2017.
 */

import Socket = SocketIO.Socket;
import {SyncServer} from "./sync-server";
import {BoxesDecorator, BoxesUser} from "./boxes";

export class StreamingDecorator extends BoxesDecorator {

    public static apply(server: SyncServer) {
        server.addRoom('streaming', StreamingUser, StreamingDecorator);
    }

    constructor(server: SyncServer) {
        super(server, 'streaming');
    }
}

class StreamingUser extends BoxesUser {

    constructor(socket: Socket, decorator: StreamingDecorator) {
        super(socket, decorator);

        socket.on('imageDrawn', (data) => {
            this.server.broadcast('imageDrawn', data, this.room);
        });
    }
}
