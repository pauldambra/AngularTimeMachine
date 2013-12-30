var expect = chai.expect;

describe('Directive: unselectable', function () {
  var element, scope, compile,
    validTemplate = '<button make-unselectable></button>';

  function createDirective(data, template) {
    var elm;

    // Create directive
    elm = compile(template || validTemplate)(scope);

    // Trigger watchers
    //scope.$apply();

    // Return
    return elm;
  }

  beforeEach(function () {

    // Load the directive's module
    module('timeMachine.directives');

//    // Provide any mocks needed
//    module(function ($provide) {
//      //$provide.value('Name', new MockName());
//    });

    // Inject in angular constructs otherwise,
    //  you would need to inject these into each test
    inject(function ($rootScope, $compile) {
      scope = $rootScope.$new();
      compile = $compile;
    });
  });

  describe('css changes', function () {
    it('should add user-select style', function() {
      var element = createDirective();
      should.exist(element);
      var userSelectStyle = element.css('user-select');
      expect(userSelectStyle).not.to.be.undefined;
      expect(userSelectStyle).to.eql('none');
    });
    it('should add outline style', function() {
      var element = createDirective();
      should.exist(element);
      var userSelectStyle = element.css('outline');
      expect(userSelectStyle).not.to.be.undefined;
      expect(userSelectStyle).to.eql('0px');
    });
  });

  describe('JS changes', function () {
    //can we test that an event listener has been registered?!
    it('should add selectstart listener');
    it('should add dragstart listener');
  });

  return describe('IE specific changes', function () {
    it('should add unselectable attribute', function() {
      var element = createDirective();
      should.exist(element);
      var userSelectStyle = element.attr('unselectable');
      expect(userSelectStyle).not.to.be.undefined;
      expect(userSelectStyle).to.eql('on');
    });
  });
});
