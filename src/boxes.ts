'use strict';
/**
 * Created by gjrwcs on 2/21/2017.
 */

import Socket = SocketIO.Socket;
import {ServerDecorator, SyncServer} from "./sync-server";
import {User} from "./user";

export class BoxesDecorator extends ServerDecorator {

    public static apply(server: SyncServer) {
        server.addRoom('boxes', BoxesUser, BoxesDecorator);
    }

    constructor(server: SyncServer) {
        super(server);
    }
}

class BoxesUser extends User {

    private static usedHues: number[] = [];

    private hue: number;

    private static isUsedHue(hue: number): boolean {
        const THRESHOLD = 10;
        return BoxesUser.usedHues.some((usedHue) => {
            return Math.abs(usedHue - hue) < THRESHOLD;
        });
    }

    private static getNewHue(): number {
        let hue = 0;
        do {
            hue = ~~(Math.random() * 255);
        } while (BoxesUser.isUsedHue(hue));

        return hue;
    }

    constructor(socket: Socket, counter: BoxesDecorator) {
        super(socket, counter.getServer());

        this.hue = BoxesUser.getNewHue();
        BoxesUser.usedHues.push(this.hue);
        socket.emit('generatedHue', this.hue);

        socket.on('boxCreated', (data) => {
            this.server.broadcast('boxCreated', data);
        });
    }
}