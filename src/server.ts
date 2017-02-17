'use strict';
/// <reference path="../node_modules/@types/node/index.d.ts" />
/**
 * Created by gjrwcs on 2/16/2017.
 */

import * as express from 'express';
import * as http from 'http';
import * as socketio from 'socket.io';
import * as Q from 'q';
import * as fs from 'fs';

class HttpServer {

    private server: http.Server;
    private app: express.Application;
    private readonly port: number = process.env.PORT || process.env.NODE_PORT || 3000;

    readFileAsync: Function;

    private static readonly MIME_TYPES: {
        'html': 'text/html'
    };

    constructor(routes: Object) {
        this.app = express();
        this.server = http.createServer(this.app);
        this.server.listen(this.port);

        this.config();
        this.routes(routes);
    }

    config() {
        this.readFileAsync = Q.denodeify(fs.readFile);
    }

    private static getMimeType(fileName: string):string {
        const extension: string = fileName.split('.').pop();
        return HttpServer.MIME_TYPES[extension];
    }

    private routes(routes: Object): void {
        Object.keys(routes).forEach((route: string) => {
            this.app.use(route, (req: express.Request, res: express.Response, next: express.NextFunction) => {
                res.sendFile(routes[route], {root: `${__dirname}/../`});
            });
        });
    }

    public getServer(): http.Server {
        return this.server;
    }
}

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

//init the application
const httpServer = new HttpServer(HTTP_ROUTES);
const syncServer = new SyncServer(httpServer.getServer());