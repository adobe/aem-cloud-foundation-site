import { readBlockConfig } from '../../scripts/lib-franklin.js';

async function fetchData(path) {
  const response = await fetch(`${path}.json`);
  return response.json();
}

export function formatTalkDate(date) {
  // 'date' is number of days since 01/01/1900; convert to millis
  const talkDate = new Date(date * 24 * 60 * 60 * 1000);
  // Remove 70 years, as JS Date starts at 1970 not 1900.
  talkDate.setFullYear(talkDate.getFullYear() - 70);
  return talkDate.toLocaleString('en-EN', { month: 'short', year: 'numeric' });
}

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = ''; // remove config from block output
  const talksJson = await fetchData(cfg.talks || '/talks');
  const speakersJson = await fetchData(cfg.speakers || '/speakers');
  talksJson.data.forEach((talk) => {
    const talkSection = document.createElement('div');
    talkSection.classList.add('talk');
    block.append(talkSection);
    const link = document.createElement('a');
    link.href = talk.URL;
    talkSection.append(link);
    const title = document.createElement('h4');
    title.textContent = talk.Title;
    link.append(title);
    const date = document.createElement('p');
    date.textContent = formatTalkDate(talk.Date);
    date.classList.add('date');
    talkSection.append(date);
    const blurb = document.createElement('p');
    blurb.textContent = talk.Blurb;
    blurb.classList.add('blurb');
    talkSection.append(blurb);
    const speakers = talk.Speaker.split(', ');
    speakers.forEach((speaker) => {
      const speakerSection = document.createElement('div');
      talkSection.append(speakerSection);
      speakerSection.classList.add('speaker');
      const speakerData = speakersJson.data.find((item) => item.Name === speaker);
      if (speakerData?.Picture) {
        const speakerImg = document.createElement('img');
        speakerImg.src = speakerData.Picture;
        speakerImg.alt = speaker;
        speakerSection.append(speakerImg);
      }
      const speakerParagraph = document.createElement('p');
      speakerParagraph.textContent = speaker;
      speakerParagraph.classList.add('name');
      speakerSection.append(speakerParagraph);
      if (speakerData?.Bio) {
        const bioParagraph = document.createElement('p');
        bioParagraph.textContent = speakerData.Bio;
        bioParagraph.classList.add('bio');
        speakerSection.append(bioParagraph);
      }
    });
  });
}
