#!/usr/bin/env node

var os = require('os');
var fs = require('fs');
var util = require('util');
var argv = require('minimist')(process.argv.slice(2), {
    default: {
        'interactive-message': 'true'
    }
});

var Aheui = require('./aheui.js');

if (argv['version']) {
    const package = require('./package');
    console.log(package.version);
    process.exit(0);
}
var left = [];
var filename = argv._[0] + '';
var sourceCode;
try {
    sourceCode = fs.readFileSync(filename, {
        encoding: 'utf8'
    });
}
catch (e) {
    console.error('file not found: ' + e.path);
    process.exit(1);
}
runCode(sourceCode);

function runCode(sourceCode) {
    var machine = new Aheui.Machine(Aheui.codeSpace(sourceCode));
    machine.input = interactiveInput;
    machine.output = function (value) {
        process.stdout.write(value + '');
    };
    machine.run(process.exit);
}


function interactiveInput(type) {
    var limit = 255;
    var platform = os.platform();
    var input;
    // print message
    if (argv['interactive-message'] !== 'false') {
        switch (type) {
        case 'number':
            process.stderr.write(' type the number and press enter: ');
            break;
        case 'character':
            process.stderr.write(' type the character and press enter: ');
            break;
        }
    }
    if (left.length !== 0) input = left.shift();
    // read user input
    else {
        switch (platform) {
        case 'win32':
            input = (function () {
                var temp = fs.readSync(process.stdin.fd, limit, 0, 'utf8')[0];
                return (left = temp.split(/\r?\n/g)).shift();
            })();
            break;
        case 'linux': case 'darwin':
            input = (function () {
                var fd = fs.openSync('/dev/stdin', 'rs');
                var buffer = new Buffer(limit);
                fs.readSync(fd, buffer, 0, buffer.length);
                fs.closeSync(fd);
                return (left = buffer.toString().split(/\r?\n/)).shift();
            })();
            break;
        default:
            throw 'unexpected platform: ' + platform;
            break;
        }
        left = left.filter(function (v) {return v !== ""});
    }
    // post-processing
    switch (type) {
    case 'number':
        input = input | 0;
        break;
    case 'character':
        input = input.charCodeAt();
        break;
    }
    return input;
}
