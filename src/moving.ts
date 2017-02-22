'use strict';
/**
 * Created by Greg on 2/21/2017.
 */

import Socket = SocketIO.Socket;
import {ServerDecorator, SyncServer} from "./sync-server";
import {User} from "./user";

export class MovingDecorator extends ServerDecorator {

    public static apply(server: SyncServer) {
        server.addRoom('moving', MovingUser, MovingDecorator);
    }

    constructor(server: SyncServer) {
        super(server, 'moving');
    }

    public getUsers(): MovingUser[] {
        return this.syncServer.getUsers().filter((user) => user instanceof MovingUser) as MovingUser[];
    }
}

class MovingUser extends User {

    private static usedHues: number[] = [];

    private hue: number;
    private x: number;
    private y: number;

    private static isUsedHue(hue: number): boolean {
        const THRESHOLD = 10;
        return MovingUser.usedHues.some((usedHue) => {
            return Math.abs(usedHue - hue) < THRESHOLD;
        });
    }

    private static getNewHue(): number {
        let hue = 0;
        do {
            hue = ~~(Math.random() * 255);
        } while (MovingUser.isUsedHue(hue));

        return hue;
    }

    constructor(socket: Socket, updater: MovingDecorator) {
        super(socket, updater.getServer());

        this.room = updater.getRoomName();
        this.hue = MovingUser.getNewHue();
        this.x = 0;
        this.y = 0;

        MovingUser.usedHues.push(this.hue);

        socket.emit('generatedHue', this.getData());
        socket.emit('sendRoomUsers', updater.getUsers().map((u) => u.getData()));
        socket.broadcast.to(this.room).emit('userJoined', this.getData());

        socket.on('updatePosition', (data) => {
            this.x = data.x;
            this.y = data.y;

            this.server.broadcast('userMoved', this.getData(), this.room);
        });
    }

    protected onDisconnect(data) {
        super.onDisconnect(data);
        this.server.broadcast('userDisconnected', this.getData(), this.room);
    }

    private getData(): Object {
        return {
            hue: this.hue,
            x: this.x,
            y: this.y,
        };
    }

}
