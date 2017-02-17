'use strict';
/// <reference path="../node_modules/@types/node/index.d.ts" />
/**
 * Created by gjrwcs on 2/16/2017.
 */

import {ExpressServer} from './express-server';
import * as http from 'http';
import * as socketio from 'socket.io';

class SyncServer {

    private io;

    constructor(httpServer: http.Server) {
        this.io = socketio(httpServer);
    }

}

const HTTP_ROUTES = {
    '/': 'client/index.html',
    '/part1': 'client/part1.html',
    '/part2': 'client/part2.html',
    '/part3': 'client/part3.html',
    '/part4': 'client/part4.html',
};

// init the application
const httpServer = new ExpressServer(HTTP_ROUTES);
const syncServer = new SyncServer(httpServer.getServer());
