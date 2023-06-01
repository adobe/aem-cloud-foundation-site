/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { formatTalkDate } from '../../../blocks/talks/talks.js';

const sleep = async (time = 1000) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(true);
  }, time);
});

function jsonOk(body) {
  const mockResponse = new window.Response(JSON.stringify(body), {
    status: 200,
    headers: {
      'Content-type': 'application/json',
    },
  });

  return Promise.resolve(mockResponse);
}

const TALKS = {
  data: [
    {
      Title: 'Talk1',
      Date: 45078,
      Blurb: 'blurb1',
      Speaker: 'speaker1',
      URL: 'http://www.test.org/talk/1',
    },
    {
      Title: 'Talk2',
      Date: 45048,
      Blurb: 'blurb2',
      Speaker: 'speaker2',
      URL: 'http://www.test.org/talk/2',
    },
    {
      Title: 'Talk3',
      Date: 44440,
      Blurb: 'blurb3',
      Speaker: 'speaker1',
      URL: 'http://www.test.org/talk/3',
    },
    {
      Title: 'Talk4',
      Date: 44441,
      Blurb: 'blurb4',
      Speaker: 'speaker1, speaker2',
      URL: 'http://www.test.org/talk/4',
    },
    {
      Title: 'Talk5',
      Date: 45078,
      Blurb: 'blurb5',
      Speaker: 'unknown_speaker',
      URL: 'http://www.test.org/talk/5',
    },
  ],
};

const SPEAKERS = {
  data: [
    {
      Name: 'speaker1',
      Picture: 'http://www.test.org/speaker/picture1.png',
      Bio: 'bio1',
    },
    {
      Name: 'speaker2',
      Picture: 'http://www.test.org/speaker/picture2.png',
      Bio: 'bio2',
    },
  ],
};

function assertTalk(actualTalk, expectedTalk, expectedSpeakers) {
  expect(actualTalk).to.exist;
  expect(actualTalk.children).to.have.length.greaterThanOrEqual(2);
  // Title & link section
  const titleLink = actualTalk.children[0];
  expect(titleLink).to.exist;
  expect(titleLink.tagName).to.equal('A');
  expect(titleLink.href).to.equal(expectedTalk.URL);
  const titleText = titleLink.children[0];
  expect(titleText).to.exist;
  expect(titleText.tagName).to.equal('H4');
  expect(titleText.textContent).to.equal(expectedTalk.Title);
  const date = actualTalk.children[1];
  expect(date.textContent).to.equal(formatTalkDate(expectedTalk.Date));
  expect(date.tagName).to.equal('P');
  expect([...date.classList]).to.contain('date');
  const blurb = actualTalk.children[2];
  expect(blurb.textContent).to.equal(expectedTalk.Blurb);
  expect(blurb.tagName).to.equal('P');
  expect([...blurb.classList]).to.contain('blurb');
  // Speaker section
  expectedSpeakers.forEach((expectedSpeaker, index) => {
    const speakerDiv = actualTalk.children[index + 3];
    expect(speakerDiv).to.exist;
    expect(speakerDiv.tagName).to.equal('DIV');
    expect([...speakerDiv.classList]).to.contain('speaker');
    const speakerPicture = speakerDiv.children[0];
    expect(speakerPicture).to.exist;
    expect(speakerPicture.tagName).to.equal('IMG');
    expect(speakerPicture.src).to.equal(expectedSpeaker.Picture);
    expect(speakerPicture.alt).to.equal(expectedSpeaker.Name);
    const speakerName = speakerDiv.children[1];
    expect(speakerName).to.exist;
    expect(speakerName.tagName).to.equal('P');
    expect([...speakerName.classList]).to.contain('name');
    expect(speakerName.textContent).to.equal(expectedSpeaker.Name);
    const speakerBio = speakerDiv.children[2];
    expect(speakerBio).to.exist;
    expect(speakerBio.tagName).to.equal('P');
    expect([...speakerBio.classList]).to.contain('bio');
    expect(speakerBio.textContent).to.equal(expectedSpeaker.Bio);
  });
}

function assertTalkWithoutSpeaker(actualTalk, expectedTalk) {
  expect(actualTalk).to.exist;
  const speakerDiv = actualTalk.children[3];
  expect(speakerDiv).to.exist;
  expect(speakerDiv.tagName).to.equal('DIV');
  expect([...speakerDiv.classList]).to.contain('speaker');
  expect(speakerDiv.children).to.have.lengthOf(1);
  const speakerName = speakerDiv.children[0];
  expect(speakerName).to.exist;
  expect(speakerName.tagName).to.equal('P');
  expect(speakerName.textContent).to.equal(expectedTalk.Speaker);
}

describe('Talks block', () => {
  // eslint-disable-next-line no-undef
  before(async () => {
    const fetchStub = sinon.stub(window, 'fetch');
    fetchStub.onCall(0).returns(jsonOk(TALKS));
    fetchStub.onCall(1).returns(jsonOk(SPEAKERS));

    const { decorateBlock, loadBlock } = await import('../../../scripts/lib-franklin.js');
    document.body.innerHTML = await readFile({ path: './block.html' });
    const talksBlock = document.querySelector('div.talks');
    await decorateBlock(talksBlock);
    await loadBlock(talksBlock);
    await sleep();
  });

  it('generates a list of talks, with their speaker data', async () => {
    const talks = document.querySelectorAll('div.talk');
    expect(talks).to.have.lengthOf(5);
    assertTalk(talks[0], TALKS.data[0], [SPEAKERS.data[0]]);
    assertTalk(talks[1], TALKS.data[1], [SPEAKERS.data[1]]);
    assertTalk(talks[2], TALKS.data[2], [SPEAKERS.data[0]]);
    assertTalk(talks[3], TALKS.data[3], SPEAKERS.data);
    assertTalkWithoutSpeaker(talks[4], TALKS.data[4]);
  });

  it('formats dates from Google sheets correctly', async () => {
    expect(formatTalkDate(45078)).to.equal('Jun 2023');
    expect(formatTalkDate(45048)).to.equal('May 2023');
    expect(formatTalkDate(44440)).to.equal('Sep 2021');
  });

  // eslint-disable-next-line no-undef
  afterEach(() => {
    // Restore the default sandbox here
    sinon.restore();
  });
});
