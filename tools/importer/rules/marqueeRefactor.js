import { flow } from '../utils.js';

function createMarqueeHeader({ block, document }) {}

function createMarqueeBackground({ block, document }) {}

function createMarqueeData({ block, document }) {}

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
  block.before(document.createElement('hr'));
  block.replaceWith(...elements);
}
