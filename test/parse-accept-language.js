var pal = require('../');

function request(language) {
  return {
    get: function get(header) {
      return (header === 'accept-language') && language;
    }
  };
}

describe('parse-accept-language node module', function () {
  it('parse empty', function () {
    var req = request('');
    var parsed = pal(req);

    parsed.should.be.instanceof(Array).and.have.lengthOf(0);

    req = request();
    parsed = pal(req);

    parsed.should.be.instanceof(Array).and.have.lengthOf(0);
  });

  it('parse standard', function () {
    var req = request('en-US,en;q=0.8,pl;q=0.6');
    var parsed = pal(req);

    parsed.should.be.instanceof(Array).and.have.lengthOf(3);

    parsed[0].q.should.eql(1);
    parsed[1].q.should.eql(0.8);
    parsed[2].q.should.eql(0.6);

    parsed[0].value.should.eql('en-US');
    parsed[1].value.should.eql('en');
    parsed[2].value.should.eql('pl');

    parsed[0].region.should.eql('US');
    parsed[1].region.should.eql('');
    parsed[2].region.should.eql('');

    parsed[0].language.should.eql('en');
    parsed[1].language.should.eql('en');
    parsed[2].language.should.eql('pl');
  });

  it('parse out of order', function () {
    var req = request('de-DE;q=0.2,pl,en-GB;q=0.6');
    var parsed = pal(req);
    parsed.should.be.instanceof(Array).and.have.lengthOf(3);

    parsed[0].q.should.eql(1);
    parsed[1].q.should.eql(0.6);
    parsed[2].q.should.eql(0.2);

    parsed[0].value.should.eql('pl');
    parsed[1].value.should.eql('en-GB');
    parsed[2].value.should.eql('de-DE');

    parsed[0].region.should.eql('');
    parsed[1].region.should.eql('GB');
    parsed[2].region.should.eql('DE');

    parsed[0].language.should.eql('pl');
    parsed[1].language.should.eql('en');
    parsed[2].language.should.eql('de');
  });
});
