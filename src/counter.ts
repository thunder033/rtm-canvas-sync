'use strict';
/**
 * Created by Greg on 2/20/2017.
 */

import Socket = SocketIO.Socket;
import {ServerDecorator, SyncServer} from "./sync-server";
import {User} from "./user";

export class CounterDecorator extends ServerDecorator {
    private value: number = 0;
    private readonly incrementAmt: number = 1;

    public static apply(server: SyncServer) {
        server.addRoom('counter', CounterUser, CounterDecorator);
    }

    constructor(server: SyncServer) {
        super(server);
    }

    public increment() {
        this.value += this.incrementAmt;
        this.syncServer.broadcast('update', this.value);
    }
}

class CounterUser extends User {

    constructor(socket: Socket, counter: CounterDecorator) {
        super(socket, counter.getServer());

        socket.on('increment', () => {
            counter.increment();
        });
    }

}
