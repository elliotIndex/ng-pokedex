// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

var SpecReporter = require('jasmine-spec-reporter').SpecReporter;
var browserstack = require('browserstack-local');
var bsCredentials = require('./bsCredentials.js');

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './e2e/**/*.e2e-spec.ts'
  ],
  seleniumAddress: 'http://hub-cloud.browserstack.com/wd/hub',
  'commonCapabilities': {
    'browserstack.user': bsCredentials.user,
    'browserstack.key': bsCredentials.key,
    'build': 'protractor-browserstack',
    'name': 'parallel_local_test',
    'browserstack.local': true,
    'browserstack.debug': 'true'
  },
  'multiCapabilities': [{
    'browserName': 'Chrome'
  }, {
    'browserName': 'Firefox'
  }, {
    'browserName': 'Safari'
  }],
  // directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 20000,
    print: function() {}
  },
  beforeLaunch: function() {
    // Start browserstack local before start of test
    console.log("Connecting local");
    return new Promise(function(resolve, reject){
      exports.bs_local = new browserstack.Local();
      exports.bs_local.start({'key': exports.config.commonCapabilities['browserstack.key'] }, function(error) {
        if (error) return reject(error);
        console.log('Connected. Now testing...');

        resolve();
      });
    });
  },

  onPrepare: function() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });

    jasmine.getEnv().addReporter(new SpecReporter({
      spec: {
        displayStacktrace: true
      }
    }));
  },

  // Code to stop browserstack local after end of test
  afterLaunch: function() {
    return new Promise(function(resolve, reject) {
      exports.bs_local.stop(resolve);
    });
  }
};

// Code to support common capabilities
exports.config.multiCapabilities.forEach(function(caps){
  for(var i in exports.config.commonCapabilities) caps[i] = caps[i] || exports.config.commonCapabilities[i];
});
