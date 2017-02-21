'use strict';
/// <reference path="../node_modules/@types/node/index.d.ts" />
/**
 * Created by gjrwcs on 2/16/2017.
 */

import {BoxesDecorator} from "./boxes";
import {CounterDecorator} from './counter';
import {ExpressServer} from './express-server';
import {SyncServer} from './sync-server';

const HTTP_ROUTES = {
    '/': 'client/index.html',
    '/part1': 'client/part1.html',
    '/part2': 'client/part2.html',
    '/part3': 'client/part3.html',
    '/part4': 'client/part4.html',
    '/priority-queue.js': 'src/priority-queue.js',
};

// init the application
const httpServer = new ExpressServer(HTTP_ROUTES);
// Create a new sync server
const syncServer = new SyncServer(httpServer.getServer());

// Each decorator defines the functionality for a room
CounterDecorator.apply(syncServer); // Part 1
BoxesDecorator.apply(syncServer); // Part 2
