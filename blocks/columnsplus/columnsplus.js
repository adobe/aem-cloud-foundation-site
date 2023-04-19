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
          // picture is only content in column
          picWrapper.classList.add('columnsplus-img-col');
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
    if (ch.length == 1) row.classList.add('columnsplus-bg-wrapper');
    if (ch.length != 1) row.classList.add(`columnsplus-${ch.length}-row`);
  });


  var lastbgwrapper=null;
  block.querySelectorAll(':scope > div').forEach((row) => {
    const ch = [...row.children];
    if (ch.length == 1) {
      const contentwrapper = document.createElement('div');
      contentwrapper.classList.add('columnsplus-content-wrapper');
      row.appendChild(contentwrapper);
      lastbgwrapper=contentwrapper;
    }
    if (ch.length > 1 && lastbgwrapper != null) lastbgwrapper.appendChild(row)
  });

  block.querySelectorAll('img').forEach((img) => {
    observer.observe(img);
  });
}
