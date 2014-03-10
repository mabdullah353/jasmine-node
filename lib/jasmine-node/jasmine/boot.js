(function() {
  var boot, growlReporter, nodeReporters;

  growlReporter = require('jasmine-growl-reporter');

  nodeReporters = require('../reporter');

  boot = function(jasmineRequire, clockCallback) {
    var clockInstaller, clockUninstaller, env, extend, jasmine, jasmineInterface;
    jasmine = jasmineRequire.core(jasmineRequire);

    /*
    Helper function for readability above.
     */
    extend = function(destination, source) {
      var name, property;
      for (name in source) {
        property = source[name];
        destination[name] = property;
      }
      return destination;
    };

    /*
    Create the Jasmine environment. This is used to run all specs in a project.
     */
    env = jasmine.getEnv();
    jasmine.TerminalReporter = nodeReporters.TerminalReporter;
    jasmine.GrowlReporter = growlReporter;

    /*
     *# The Global Interface
    *
    Build up the functions that will be exposed as the Jasmine public interface. A project can customize, rename or alias any of these functions as desired, provided the implementation remains unchanged.
     */
    jasmineInterface = {
      describe: function(description, specDefinitions) {
        return env.describe(description, specDefinitions);
      },
      xdescribe: function(description, specDefinitions) {
        return env.xdescribe(description, specDefinitions);
      },
      it: function(desc, func) {
        return env.it(desc, func);
      },
      xit: function(desc, func) {
        return env.xit(desc, func);
      },
      beforeEach: function(beforeEachFunction) {
        return env.beforeEach(beforeEachFunction);
      },
      afterEach: function(afterEachFunction) {
        return env.afterEach(afterEachFunction);
      },
      expect: function(actual) {
        return env.expect(actual);
      },
      pending: function() {
        return env.pending();
      },
      spyOn: function(obj, methodName) {
        return env.spyOn(obj, methodName);
      }
    };

    /*
    Add all of the Jasmine global/public interface to the proper global, so a project can use the public interface directly. For example, calling `describe` in specs instead of `jasmine.getEnv().describe`.
     */
    extend(global, jasmineInterface);
    global.jasmine = jasmine;
    clockInstaller = jasmine.currentEnv_.clock.install;
    clockUninstaller = jasmine.currentEnv_.clock.uninstall;
    jasmine.currentEnv_.clock.install = function() {
      clockCallback(true, env.clock);
      return clockInstaller();
    };
    jasmine.currentEnv_.clock.uninstall = function() {
      clockCallback(false, env.clock);
      return clockUninstaller();
    };

    /*
    Expose the interface for adding custom equality testers.
     */
    jasmine.addCustomEqualityTester = function(tester) {
      return env.addCustomEqualityTester(tester);
    };

    /*
    Expose the interface for adding custom expectation matchers
     */
    jasmine.addMatchers = function(matchers) {
      return env.addMatchers(matchers);
    };

    /*
    Expose the mock interface for the JavaScript timeout functions
     */
    jasmine.clock = function() {
      return env.clock;
    };
    return jasmine;
  };

  module.exports = {
    boot: boot
  };

}).call(this);