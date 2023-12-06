#!/usr/bin/env node

/*
 * oooooooooo.                                        ooo        ooooo ooooooooo.   
 * `888'   `Y8b                                       `88.       .888' `888   `Y88. 
 *  888     888  .ooooo.   .oooo.   ooo. .oo.  .oo.    888b     d'888   888   .d88' 
 *  888oooo888' d88' `88b `P  )88b  `888P"Y88bP"Y88b   8 Y88. .P  888   888ooo88P'  
 *  888    `88b 888ooo888  .oP"888   888   888   888   8  `888'   888   888         
 *  888    .88P 888    .o d8(  888   888   888   888   8    Y     888   888         
 * o888bood8P'  `Y8bod8P' `Y888""8o o888o o888o o888o o8o        o888o o888o                                                                                     
 *  ========================================================================
 *  Copyright (c) 2019-2023 BeamMP Ltd. All rights reserved.
 */

require('dotenv').config()
const pkg = require('./package.json')
const chalk = require('chalk');
const cluster = require('cluster');

const error = chalk.bold.keyword('red');
const warn = chalk.keyword('orange');
const good = chalk.keyword('lime');

process.on('warning', (warning) => {
	console.log(warning.stack);
});

if (cluster.isMaster) {

	const env = process.env.NODE_ENV || 'development'

	console.log('oooooooooo.                                        ooo        ooooo ooooooooo.   ')
	console.log('`888\'   `Y8b                                       `88.       .888\' `888   `Y88. ')
	console.log(' 888     888  .ooooo.   .oooo.   ooo. .oo.  .oo.    888b     d\'888   888   .d88\' ')
	console.log(' 888oooo888\' d88\' `88b `P  )88b  `888P"Y88bP"Y88b   8 Y88. .P  888   888ooo88P\'  ')
	console.log(' 888    `88b 888ooo888  .oP"888   888   888   888   8  `888\'   888   888         ')
	console.log(' 888    .88P 888    .o d8(  888   888   888   888   8    Y     888   888         ')
	console.log('o888bood8P\'  `Y8bod8P\' `Y888""8o o888o o888o o888o o8o        o888o o888o        ')
	console.log('=================================================================================')
	console.log('Website v' + pkg.version + ' Copyright (C) 2019-2024 BeamMP Ltd')
	console.log('')
	console.log('Running in: ' + env)
	console.log('Server Time: ' + new Date())

	function start() {
		process.title = pkg.name + "@" + pkg.version;


		if (cluster.isMaster) {
			console.log(`Master PID: ${process.pid}`)
			console.log(`Creating ${process.env.INSTANCES} Instances of the Website Backend`)
			for (let i = 0; i < process.env.INSTANCES; i++) {
				cluster.fork();
			}
			// set console's directory so we can see output from workers
			console.dir(cluster.workers, { depth: 0 });

			cluster.on('exit', (worker, code) => {
				// Good exit code is 0 :))
				// exitedAfterDisconnect ensures that it is not killed by master cluster or manually
				// if we kill it via .kill or .disconnect it will be set to true
				// \x1b[XXm represents a color, and [0m represent the end of this 
				//color in the console ( 0m sets it to white again )
				if (code !== 0 && !worker.exitedAfterDisconnect) {
					console.error(`\x1b[34mWorker ${worker.process.pid} crashed... Starting a new worker...\x1b[0m`);
					const nw = cluster.fork();
					console.error(`\x1b[32mWorker ${nw.process.pid} will replace him \x1b[0m`);
				}
			});
		} else {
			console.error('FATAL: This script can only be run as a master process.')
		}
	}

	start()
} else {
	const ws = require('./src/webserver')

	try {
		ws.init(function (err) {
      if (err) {
        console.error(err)
        return
      }

      ws.listen(function () {
        console.info('BeamMP Website Ready')
      })
    })
	}	catch (e) {
		throw e;
	}
}
