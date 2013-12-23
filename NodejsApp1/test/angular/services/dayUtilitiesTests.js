var should = chai.should();

describe("The day utilities service", function() {

  beforeEach(function() {
    module('timeMachine.services.days');
  });

  it('should be able to inject the service', inject(function(dayUtilities) {
    dayUtilities.should.not.eql(null);
    dayUtilities.should.have.property('dayPartLength');
    dayUtilities.should.have.property('dayTotal');
    dayUtilities.should.have.property('weekTotal');
  }));

  it('should calculate day part length', inject(function(dayUtilities) {
    var dayPart = {
      start: new Date('2013-05-12T00:00:00.000Z'),
      finish: new Date('2013-05-12T03:15:00.000Z')
    };
    var result = dayUtilities.dayPartLength(dayPart);
    result.should.eql(3.25);
  }));

  it('should calculate day total', inject(function(dayUtilities){
    var day = new Day('2013-05-12T00:00:00.000Z');
    day.parts = [
      {
        start: new Date('2013-05-12T00:00:00.000Z'),
        finish: new Date('2013-05-12T03:15:00.000Z')
      },
      {
        start: new Date('2013-05-12T05:00:00.000Z'),
        finish: new Date('2013-05-12T08:30:00.000Z')
      }
    ];
    var result = dayUtilities.dayTotal(day);
    result.should.equal(6.75);
  }));
  it('should calculate week total', inject(function(dayUtilities){
    var dayOne = new Day('2013-05-12T00:00:00.000Z');
    dayOne.parts = [
      {
        start: new Date('2013-05-12T00:00:00.000Z'),
        finish: new Date('2013-05-12T03:15:00.000Z')
      },
      {
        start: new Date('2013-05-12T05:00:00.000Z'),
        finish: new Date('2013-05-12T08:30:00.000Z')
      }
    ];
    var dayTwo = new Day('2013-05-13T00:00:00.000Z');
    dayTwo.parts = [
      {
        start: new Date('2013-05-13T00:00:00.000Z'),
        finish: new Date('2013-05-13T05:30:00.000Z')
      },
      {
        start: new Date('2013-05-13T05:00:00.000Z'),
        finish: new Date('2013-05-13T06:15:00.000Z')
      }
    ];
    var result = dayUtilities.weekTotal([dayOne, dayTwo]);
    result.should.equal(13.5)
  }));
});
