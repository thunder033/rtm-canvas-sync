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
    private room: string;
    private server: SyncServer;

    constructor(socket: Socket, server: SyncServer) {
        this.server = server;
        this.socket = socket;

        socket.on(IOEvent.join, this.onJoin.bind(this));
        socket.on('msg', this.onMsg.bind(this));
        socket.on(IOEvent.disconnect, this.onDisconnect.bind(this));
        socket.on('delivered', this.onDelivered.bind(this));
    }

    private onJoin(data) {
        const room = this.server.getRoom();

        this.name = data.name;
        this.socket.join(room);
    }

    private onDelivered(data): void {

    }

    private onMsg(data) {

    }

    private onDisconnect(data) {

    }
}