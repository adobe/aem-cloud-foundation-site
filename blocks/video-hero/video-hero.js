export default function decorate(block) {
  const videoLink = block.querySelector('h1 > a');
  if (videoLink) {
    const videoWrapper = videoLink.closest('div');
    if (videoWrapper && videoWrapper.children.length === 1) {
      const videoElement = document.createElement('video');
      const sourceElement = document.createElement('source');
      sourceElement.src = videoLink.href;
      sourceElement.type = 'video/mp4';
      videoElement.appendChild(sourceElement);
      videoElement.autoplay = true;
      videoElement.loop = true;
      videoElement.playsInline = true;
      videoElement.muted = true;
      const h1 = videoLink.parentElement;
      h1.textContent = videoLink.textContent;
      videoLink.replaceWith(videoElement);
      h1.after(videoElement);
    }
  }
}
