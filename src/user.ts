'use strict';
/**
 * Created by Greg on 2/17/2017.
 */
import {IOEvent, SyncServer} from './sync-server';
import Socket = SocketIO.Socket;
import Timer = NodeJS.Timer;

export class User {

    private socket: Socket;
    private name: string;
    private server: SyncServer;

    constructor(socket: Socket, server: SyncServer) {
        this.server = server;
        this.socket = socket;

        socket.on(IOEvent.join, this.onJoin.bind(this));
        socket.on(IOEvent.disconnect, this.onDisconnect.bind(this));
    }

    public addEventListener(evt: string, handler: Function): void {
        this.socket.on(evt, (data) => {
            handler(data, this, this.socket, this.server);
        });
    }

    private onJoin(data) {
        console.log(`${data.name} joined`);
        const room = this.server.getRoom();

        this.name = data.name;
        this.socket.join(room);
    }

    private onDisconnect(data) {
        if (!this.server.removeUser(this)) {
            console.warn(`Failed to remove user [${this.name}] from the server`);
        }
    }
}
