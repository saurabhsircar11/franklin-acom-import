import { flow } from '../utils.js';

/**
 *
 * @param {HTMLDivElement} block
 * @returns {HTMLImageElement}
 */
function makeBGImage(block) {
  const bgImage = block?.querySelector('div[style]');
  const image = bgImage?.getAttribute('style').split('"')[1];
  let imageUrl = [];
  if (image.indexOf('http://localhost:3001') !== -1) {
    imageUrl = image.split('http://localhost:3001');
  }
  const imageTag = document.createElement('img');
  imageTag.src = imageUrl.length
    ? `https://www.adobe.com${imageUrl[1]}`
    : image;
  return imageTag;
}

/**
 *
 * @param {HTMLDivElement} block
 * @returns {string}
 */
function makeBGColor(block) {
  return (
    block.querySelector('div[data-bgcolor]')?.getAttribute('data-bgcolor') ??
    'No colour'
  );
}

/**
 *
 * @param {HTMLDivElement} block
 * @returns {HTMLAnchorElement}
 */
function makeVideo(block) {
  const videoWrapper = block?.querySelector('.video-Wrapper source');
  const backgroundVideoURL = videoWrapper.getAttribute('src');
  const a = document.createElement('a');
  a.innerHTML = backgroundVideoURL;
  a.setAttribute('href', backgroundVideoURL);
  return a;
}

/**
 * Function to evaluate type of Marquee on basis of height
 * @param {Number} marqueeHeight
 * @returns {String} returns the variation of marquee
 */
function marqueeVariation(marqueeHeight) {
  switch (marqueeHeight) {
    case 360:
      return 'Marquee (small)';
    case 560:
      return 'Marquee';
    case 700:
      return 'Marquee (large)';
    default:
      return 'Marquee';
  }
}
/**
 *
 * @param {{block: HTMLDivElement}} inputParams
 * @returns {Array<string>}
 */
function createMarqueeHeader({ block }) {
  const blockHeight = parseInt(block?.getAttribute('data-height') ?? 0, 10);
  const marqueeHeader = marqueeVariation(blockHeight);
  return [[marqueeHeader]];
}

/**
 *
 * @param {{block: HTMLDivElement}} inputParams
 * @returns {Array<String | HTMLAnchorElement | HTMLImageElement}
 */
function createMarqueeBackground({ block }) {
  const isVideo = !!block?.querySelector('.video-Wrapper source');
  const isBackgroundColor = !!block?.querySelector('div[data-bgcolor]');
  const isBgImage = !!block.querySelector('div[style]');
  if (isVideo) {
    const video = makeVideo(block);
    return [[video]];
  }
  if (isBackgroundColor) {
    const bgcolor = makeBGColor(block);
    return [[bgcolor]];
  }
  if (isBgImage) {
    const bgImage = makeBGImage(block);
    return [[bgImage]];
  }
  return [];
}

function createMarqueeData() {
  return [];
}

/**
 * Function for building Marquee,
 * @param {HTMLDivElement} block
 * @param {HTMLDocument} document
 * @returns {Array<HTMLElement>} returns array of elements
 */
function createMarquee(block, document) {
  const inputParams = {
    block,
    document,
  };
  const elements = flow(
    createMarqueeHeader,
    createMarqueeBackground,
    createMarqueeData,
  )(inputParams);
  return elements;
}

export default function createMarqueeBlocks(block, document) {
  const elements = createMarquee(block, document);
  const table = window.WebImporter.DOMUtils.createTable(elements, document);
  block.before(document.createElement('hr'));
  table.classList.add('import-table');
  block.replaceWith(table);
}
