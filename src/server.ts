'use strict';
/// <reference path="../node_modules/@types/node/index.d.ts" />
/**
 * Created by gjrwcs on 2/16/2017.
 */

import {ExpressServer} from './express-server';
import {SyncServer} from './sync-server';

const HTTP_ROUTES = {
    '/': 'client/index.html',
    '/part1': 'client/part1.html',
    '/part2': 'client/part2.html',
    '/part3': 'client/part3.html',
    '/part4': 'client/part4.html',
};

// init the application
const httpServer = new ExpressServer(HTTP_ROUTES);
// Create a new sync server
const syncServer = new SyncServer(httpServer.getServer());

class CounterServer {
    private syncServer: SyncServer;
    private counter: number = 0;
    private readonly increment: number = 1;

    constructor(server: SyncServer) {
        this.syncServer = server;

        server.addEventListener('increment', (io) => {
            console.log('increment');
            this.counter += this.increment;
            io.sockets.in(syncServer.getRoom()).emit('update', this.counter);
        });
    }
}

const counterServer = new CounterServer(syncServer);
