/* global WebImporter */
const createTextBlock = (textElement, document) => {
  const title = textElement.querySelector('h1,h2');
  const cells = [['text(full-width)']];
  const cellContent = document.createElement('div');
  if (title) {
    cellContent.appendChild(title);
  }
  const paras = textElement.querySelectorAll('.text p');
  paras.forEach((para) => {
    if (!para.querySelector('a')) {
      const detail = document.createElement('p');
      detail.innerHTML = para.textContent;
      cellContent.appendChild(detail);
    }
  });
  const links = textElement.querySelectorAll('.text a');
  links.forEach((link) => {
    cellContent.appendChild(link);
  });
  if (cellContent.childElementCount) {
    cells.push([cellContent]);
  }
  const table = WebImporter.DOMUtils.createTable(cells, document);
  table.classList.add('import-table');
  textElement.replaceWith(table);
};

const setCardType = (cardsLength) => {
  let cardType = '3-up';
  if ([1, 2, 4].includes(cardsLength)) {
    cardType = '2-up';
  }
  return cardType;
};

const attachBackgroundImage = (section, document) => {
  const tags = [...section.querySelectorAll('div[style]')];
  tags.forEach((tag) => {
    const url = tag.getAttribute('style').split('"')[1];
    const imageLink = document.createElement('a');
    imageLink.innerHTML = url;
    imageLink.href = url;
    tag.insertAdjacentElement('afterend', imageLink);
  });
};

export default function createCardsBlock(block, document, cardConfig = {}) {
  const { isCardBlockNested = false, additionalSection = [] } = cardConfig;
  const cass = block.querySelector('.consonantcardcollection');
  if (cass) {
    const cells = [['Columns']];
    const config = cass
      .querySelector('consonant-card-collection')
      .getAttribute('data-config');
    const caasLink = document.createElement('a');
    caasLink.href = `https://milo.adobe.com/tools/caas#${btoa(config)}`;
    caasLink.innerHTML = 'Content as a service';
    cells.push([caasLink]);
    const caasTable = WebImporter.DOMUtils.createTable(cells, document);
    caasTable.classList.add('import-table');
    block.before(document.createElement('hr'));
    block.replaceWith(caasTable);
  } else if (isCardBlockNested) {
    let cardType = '';
    const elements = [];
    const { children } = block;
    const filterFlex = [...children].filter(
      (node) => node.className === 'flex',
    );
    let contentBlock = '';
    if (filterFlex.length > 1) {
      contentBlock = children[children.length - 1].querySelector(
        '.dexter-FlexContainer-Items',
      );
    } else {
      contentBlock = block;
    }

    elements.push(contentBlock);

    elements.forEach((container) => {
      const columns = [...container.children];
      if (columns.length === 0) return;
      if (columns.length > 0 && columns[0].classList.contains('text')) {
        createTextBlock(columns[0], document);
        columns.shift();
      }
      if (columns.length > 1) {
        cardType = setCardType(columns.length);
        columns.forEach((col) => {
          const cells = [['Card']];
          const row = [];
          attachBackgroundImage(col, document);
          row.push(col.innerHTML);
          cells.push(row);
          const table = WebImporter.DOMUtils.createTable(cells, document);
          table.classList.add('import-table');
          col.replaceWith(table);
        });
      } else {
        const tc = columns[0].textContent.trim();
        if (tc !== '') {
          container.append(document.createElement('hr'));
        }
      }
    });
    const sectionCells = [
      ['Section metadata'],
      ['style', `xl spacing, ${cardType}`],
      ...additionalSection,
    ];
    const sectionTable = WebImporter.DOMUtils.createTable(
      sectionCells,
      document,
    );
    sectionTable.classList.add('import-table');
    block.before(document.createElement('hr'));
    block.replaceWith(...block.querySelectorAll('.import-table'), sectionTable);
  } else {
    const containers = [
      ...block.querySelectorAll('.dexter-FlexContainer-Items'),
    ].filter((c) => {
      if (c.childElementCount < 2) return false;
      let ancestor = c;
      let keep;
      do {
        ancestor = ancestor.parentElement.closest(
          '.dexter-FlexContainer-Items',
        );
        keep = !ancestor || ancestor.childElementCount < 2;
      } while (ancestor && keep);
      return keep;
    });

    let cardType = '';

    containers.forEach((container) => {
      const columns = [...container.children];
      if (columns.length === 0) return;
      if (columns.length > 0 && columns[0].classList.contains('text')) {
        createTextBlock(columns[0], document);
        columns.shift();
      } else {
        const title = block.querySelector('.title');
        if (title) {
          createTextBlock(title, document);
        }
        const text = block.querySelector('.text');
        if (text) {
          createTextBlock(text, document);
        }
      }
      if (columns.length > 1) {
        cardType = setCardType(columns.length);
        columns.forEach((col) => {
          const cells = [['Card']];
          const row = [];
          attachBackgroundImage(col, document);
          row.push(col.innerHTML);
          cells.push(row);
          const table = WebImporter.DOMUtils.createTable(cells, document);
          table.classList.add('import-table');
          col.replaceWith(table);
        });
      } else {
        const column = columns[0];
        const allCardsWrapper = column.querySelector('.dexter-FlexContainer .dexter-FlexContainer-Items');
        const allCards = [...allCardsWrapper.children];
        cardType = setCardType(allCards.length);
        allCards.forEach((col) => {
          const cells = [['Card']];
          const row = [];
          attachBackgroundImage(col, document);
          row.push(col.innerHTML);
          cells.push(row);
          const table = WebImporter.DOMUtils.createTable(cells, document);
          table.classList.add('import-table');
          col.replaceWith(table);
        });
      }
    });
    const sectionCells = [
      ['Section metadata'],
      ['style', `xl spacing, ${cardType}`],
    ];
    const sectionTable = WebImporter.DOMUtils.createTable(
      sectionCells,
      document,
    );
    sectionTable.classList.add('import-table');
    block.before(document.createElement('hr'));
    block.replaceWith(...block.querySelectorAll('.import-table'), sectionTable);
  }
}
