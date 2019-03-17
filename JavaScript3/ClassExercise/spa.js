function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status < 400) {
        resolve(xhr.response);
      } else {
        reject(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };

    xhr.send();
  });
}

function createAndAppend(name, parent, options = {}) {
  const elem = document.createElement(name);
  parent.appendChild(elem);
  Object.keys(options).forEach(key => {
    const value = options[key];
    if (key === 'text') {
      elem.textContent = value;
    } else {
      elem.setAttribute(key, value);
    }
  });
  return elem;
}

function main(url) {
  const root = document.getElementById('root');
  fetchJSON(url)
    .catch(reject => {
      createAndAppend('div', root, {
        text: reject.message,
        class: 'alert-error',
      });
    })
    .then(data => {
      // createAndAppend('pre', root, { text: JSON.stringify(data) });
      createAndAppend('header', root, { id: 'topArea', class: 'header' });
      const topArea = document.getElementById('topArea');
      createAndAppend('p', topArea, { id: 'title', text: 'ID: ' });
      createAndAppend('select', topArea, { id: 'selectRepo', class: 'repo-selector' });
      selectOptions(data);
      displayInformation(data[0]);
      document.getElementById('selectRepo').onchange = function() {
        let selectedItem = this.options[this.selectedIndex].value;
        let infoDiv = document.getElementById('rightArea');
        infoDiv.parentNode.removeChild(infoDiv);

        displayInformation(data[selectedItem]);
      };
    });
}

function selectOptions(nameOption) {
  // let selectRepo = document.getElementById('selectRepo');
  for (let i = 0; i < nameOption.length; i++) {
    createAndAppend('option', selectRepo, { value: i, text: nameOption[i].name });
  }
}

// Information displayed
function displayInformation(element) {
  let infoDiv = createAndAppend('div', root, {
    id: 'rightArea',
    class: 'right-div whiteframe',
  });
  createAndAppend('table', infoDiv, { id: 'table' });
  const table = document.getElementById('table');
  createAndAppend('tbody', table, { id: 'tbody' });
  function createTableRow(label, description) {
    const tRow = createAndAppend('tr', table);
    createAndAppend('td', tRow, { text: label, class: 'label' });
    createAndAppend('td', tRow, { text: description });
  }

  createTableRow('ID: ', element.id);
  createTableRow('Name: ', element.name);
  let date2 = new Date(element.birthdate).toLocaleString();
  createTableRow('Date of Birth : ', date2);
}

const HYF_REPOS_URL = 'http://ec2-3-89-131-59.compute-1.amazonaws.com:8080/users';

window.onload = () => main(HYF_REPOS_URL);
/* JSON we are loading:
[
  { id: 1, name: 'Mike Sanoh', birthdate: '2019-03-17T08:57:40.112+0000' },
  { id: 2, name: 'Oumar Sanoh', birthdate: '2019-03-17T08:57:40.112+0000' },
  { id: 3, name: 'Farouk Sanoh', birthdate: '2019-03-17T08:57:40.112+0000' },
]; */
