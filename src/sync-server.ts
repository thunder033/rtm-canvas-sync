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

    private io;
    private connections: User[];
    private roomName: string = 'room1';

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

    public addEventListener(evt: string, handler: Function): void {
        console.log('register evt ' + evt);
        this.io.sockets.on(evt, (data) => {
            console.log(evt);
            handler(this.io, data);
        });
    }

    /**
     * Removes a user from the room and indicates if there were successfully removed
     * @param targetUser
     * @returns {boolean}
     */
    public removeUser(targetUser: User): boolean {
        return this.connections.some((user: User, i: number) => {
            if (targetUser === user) {
                this.connections.splice(i, 1);
                return true;
            }

            return false;
        });
    }
}
