function decorateVideo(videoLink) {
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
    videoLink.replaceWith(videoElement);
    videoWrapper.classList.add('carousel-img-panel');
  }
}

function rotateCarousel(block) {
  const panelContainers = block.querySelectorAll('.carousel-panel-container');

  let visible = [...panelContainers].findIndex((panelContainer) => !panelContainer.classList.contains('carousel-hidden'));

  panelContainers[visible].classList.add('carousel-hidden');
  visible = (visible + 1) % panelContainers.length;
  panelContainers[visible].classList.remove('carousel-hidden');
}

export default function decorate(block) {
  const panels = [...block.children];
  block.classList.add(`carousel-${panels.length}-panels`);

  // setup image panels
  [...block.children].forEach((panel) => {
    const pic = panel.querySelector('picture');
    if (pic) {
      const picWrapper = pic.closest('div');
      if (picWrapper && picWrapper.children.length === 1) {
        // picture is only content in panel
        picWrapper.classList.add('carousel-img-panel');
      }
    }
    const link = panel.querySelector('a');
    if (link && link.href.endsWith('.mp4')) {
      decorateVideo(link);
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('enter');
      }
    });
  });

  block.querySelectorAll(':scope > div').forEach((panelContainer, index) => {
    if (index > 0) panelContainer.classList.add('carousel-hidden');
    panelContainer.classList.add('carousel-panel-container');
  });

  setInterval(rotateCarousel, 10000, block);

  block.querySelectorAll(':scope > div > div').forEach((panel) => {
    panel.classList.add('carousel-panel');
  });

  block.querySelectorAll('img, video').forEach((media) => {
    observer.observe(media);
  });
}
