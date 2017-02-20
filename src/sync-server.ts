'use strict';
/**
 * Created by Greg on 2/17/2017.
 */
import * as http from 'http';
import * as socketio from 'socket.io';
import {User} from './user';

function strEnum<T extends string>(o: T[]): {[K in T]: K} {
    return o.reduce((res, key) => {
        res[key] = key;
        return res;
    }, Object.create(null));
}

export const IOEvent = strEnum([
    'connection',
    'join',
    'disconnect',
]);

export class SyncServer {

    private connections: User[];
    private roomName: string = 'room1';
    private io;

    constructor(httpServer: http.Server) {
        this.connections = [];

        this.io = socketio(httpServer);
        this.io.sockets.on(IOEvent.connection, (e) => this.registerConnection(e));
    }

    public registerConnection(socket) {
        this.connections.push(new User(socket, this));
    };

    public getRoom(): string {
        return this.roomName;
    }
}
