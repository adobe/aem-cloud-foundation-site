export default function decorate(block) {
  const img = block.querySelector('picture > img');
  if (img) {
    const wrapperDiv = document.querySelector('div .fixedbackground');
    if (wrapperDiv) {
      wrapperDiv.style.backgroundImage = `url(${img.src})`;
      img.parentElement.parentElement.remove();
      const element = wrapperDiv.querySelector('h1,h2,h3,h4,p');
      element.closest('div').classList.add('fixedbackground-content');
    }
  }
}
