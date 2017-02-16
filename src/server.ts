'use strict';
/// <reference path="../node_modules/@types/node/index.d.ts" />
/**
 * Created by gjrwcs on 2/16/2017.
 */

import * as express from 'express';
import * as http from 'http';

const app: express.Application = express();

app.get('/', (req: http.IncomingMessage, res: http.ServerResponse) => {
    console.log('hello world');
});
