export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('enter');
      }
    });
  });

  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    if (!cell.previousElementSibling) cell.classList.add('columns-left');
    if (!cell.nextElementSibling) cell.classList.add('columns-right');
  });
  block.querySelectorAll('img').forEach((img) => {
    observer.observe(img);
  });
}
