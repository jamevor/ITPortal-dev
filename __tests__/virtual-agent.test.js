const VirtualAgent = require('../server/modules/virtual-agent');
const fs = require('fs');
const path = require('path');
let Intro = null;

beforeAll(() => {
  Intro = new VirtualAgent(undefined, { resave: true });
});

describe('VirtualAgent config', () => {

  test('it exists', () => {
    expect(Intro).not.toBeNull();
  });

  test('its name is correct', () => {
    expect(Intro.name).toBe('InTRo');
  });

  test('resave is enabled', () => {
    expect(Intro.resave).toBe(true);
  });

  test('filename is default', () => {
    expect(Intro.filename).toBe('intro.nlp');
  });

});

describe('VirtualAgent training', () => {
  
  test('it will throw and error with bad data', async() => {
    const badTrainingData = 'string instead';
    await expect(Intro.train({NLPData: badTrainingData, NLGData: badTrainingData})).rejects.toMatch('data must be array');
  });

  test('it can be trained and saved', async() => {
    const trainingData = JSON.parse(fs.readFileSync(path.join(__dirname, 'virtual-agent-training-data.json')));
    const result = await Intro.train({NLPData: trainingData.NLPData, NLGData: trainingData.NLGData});
    expect(result).toBe(true);
  });

});

describe('VirtualAgent processing', () => {

  test('completely unrelated to everything', async() => {
    const result = await Intro.process('I saw spiderman eating spaghetti today in the city!');
    expect(result).toBe(false);
  });

  test('Windows 10 wireless (1)', async() => {
    let result = await Intro.process('How do I get wifi on my Windows 10 PC?');
    expect(result).toBe('help.wireless');
  });

  test('Windows 10 wireless (2)', async() => {
    let result = await Intro.process('Help me install wireless on windows');
    expect(result).toBe('help.wireless');
  });

});

describe('ask Intro', () => {

  test('ask about windows 10 wireless (1)', async() => {
    let result = await Intro.ask('How do I get wifi on my Windows 10 PC?');
    expect(result).toBe('help.wireless');
  });

  test('ask about windows 10 wireless (2)', async() => {
    let result = await Intro.ask('Help me install wireless on windows');
    expect(result).toBe('help.wireless');
  });

});