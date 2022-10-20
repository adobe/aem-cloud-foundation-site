import { createOptimizedPicture, readBlockConfig, decorateIcons } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  const showcasesPath = cfg.showcases || '/showcases';
  const resp = await fetch(`${showcasesPath}.plain.html`);
  const html = await resp.text();
  let showcases = document.createElement('div');
  showcases.innerHTML = html;
  await decorateIcons(showcases);
  block.append(showcases);

  /* change to ul, li */
  const ul = document.createElement('ul');
  showcases = showcases.querySelector('.showcases');
  [...showcases.children].forEach((row) => {
    const li = document.createElement('li');
    li.innerHTML = row.innerHTML;
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'showcases-card-image';
      else div.className = 'showcases-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  showcases.textContent = '';
  showcases.append(ul);
}
