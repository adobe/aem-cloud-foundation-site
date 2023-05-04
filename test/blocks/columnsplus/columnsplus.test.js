/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const sleep = async (time = 1000) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(true);
  }, time);
});

describe('ColumnsPlus block', () => {
  // eslint-disable-next-line no-undef
  before(async () => {
    const { decorateBlock, loadBlock } = await import('../../../scripts/lib-franklin.js');
    document.body.innerHTML = await readFile({ path: './block.html' });
    const columnPlusBlock = document.querySelector('div.columnsplus');
    await decorateBlock(columnPlusBlock);
    await loadBlock(columnPlusBlock);
    await sleep();
  });

  it('Replace mp4 link with a video element', async () => {
    const video = document.querySelector('video');
    expect(video).to.exist;
    expect(video.loop).to.be.true;
    expect(video.autoplay).to.be.true;
    expect(video.muted).to.be.true;
    expect(video.playsInline).to.be.true;

    const source = video.firstElementChild;
    expect(source).to.exist;
    expect(source.src).to.equal('http://localhost:2000/media_10e3adbdc11b9eb6fa90c626414146f99f000a68f.mp4');
    expect(source.type).to.equal('video/mp4');
  });
});
