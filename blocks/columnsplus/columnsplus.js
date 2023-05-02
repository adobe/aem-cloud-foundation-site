/**
 * Gets approximate brightness for an image using a canvas to check pixel colors
 * @param {HTMLImageElement} image the image to check the color of
 * @param {HTMLCanvasElement} canvas canvas to use for loading the image pixels
 * @returns Uint8ClampedArray(4)
 */
function getBrightness(image, canvas) {
  canvas.width = image.width;
  canvas.height = image.height;
  canvas.getContext('2d', { willReadFrequently: true }).drawImage(image, 0, 0, image.width, image.height);
  const p1 = canvas.getContext('2d').getImageData(1, 1, 1, 1).data;
  const p2 = canvas.getContext('2d').getImageData(image.width / 2, image.height / 2, 1, 1).data;
  const p3 = canvas.getContext('2d').getImageData(image.width / 4, image.height / 3, 1, 1).data;
  const sum = p1[0] + p1[1] + p1[2] + p2[0] + p2[1] + p2[2] + p3[0] + p3[1] + p3[2];
  return sum / 9;
}

/**
 * Sets class on a wrapper based on the average brightness of its background image.
 * @param {HTMLImageElement} image the image to check the color of
 * @param {HTMLCanvasElement} canvas canvas to use for loading the image pixels
 * @param {HTMLDivElement} wrapper wrapper div containing the background image
 */
function setClassForBrightness(image, canvas, wrapper) {
  const brightness = getBrightness(image, canvas);

  if (brightness > 128) {
    wrapper.classList.add('bg-wrapper-bright');
  } else {
    wrapper.classList.add('bg-wrapper-dark');
  }
}

export default function decorate(block) {
  const cols = [...block.firstElementChild.nextElementSibling.children];
  block.classList.add(`columnsplus-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          if (row.children.length === 1) {
            picWrapper.classList.add('columnsplus-bg-img-row');
            const canvas = document.createElement('canvas');
            picWrapper.appendChild(canvas);
            const image = pic.querySelector('img');

            if (image.complete) {
              picWrapper.classList.add('bg-img-loaded');
              setClassForBrightness(image, canvas, picWrapper.parentNode);
            }
            image.addEventListener('load', () => {
              picWrapper.classList.add('bg-img-loaded');
              setClassForBrightness(image, canvas, picWrapper.parentNode);
            });
          } else {
            // picture is only content in column
            picWrapper.classList.add('columnsplus-img-col');
          }
        }
      }
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('enter');
      }
    });
  });

  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    if (!cell.previousElementSibling && !cell.nextElementSibling) cell.classList.add('columnsplus-single');
    if (!cell.previousElementSibling && cell.nextElementSibling) cell.classList.add('columnsplus-left');
    if (!cell.nextElementSibling && cell.previousElementSibling) cell.classList.add('columnsplus-right');
    if (cell.previousElementSibling && cell.nextElementSibling) cell.classList.add('columnsplus-middle');
  });

  block.querySelectorAll(':scope > div').forEach((row) => {
    const ch = [...row.children];
    if (ch.length === 1) row.classList.add('columnsplus-bg-wrapper');
    if (ch.length !== 1) row.classList.add(`columnsplus-${ch.length}-row`);
    if (ch.length !== 1) row.classList.add('columnsplus-row');
  });

  let lastbgwrapper = null;
  block.querySelectorAll(':scope > div').forEach((row) => {
    const ch = [...row.children];
    if (ch.length === 1) {
      const contentwrapper = document.createElement('div');
      contentwrapper.classList.add('columnsplus-content-wrapper');
      row.appendChild(contentwrapper);
      lastbgwrapper = contentwrapper;
    }
    if (ch.length > 1 && lastbgwrapper != null) lastbgwrapper.appendChild(row);
  });

  block.querySelectorAll('img').forEach((img) => {
    observer.observe(img);
  });
}
