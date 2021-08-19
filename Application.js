class Application {
  constructor(param) {
    const app = this;
    this.el = param.el;
    this.el.innerHTML = '';
    this.el.append(this.getBasicDOM());

    this.el.querySelector('.header__input').addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' || !this.value.trim()) return;

      const id = Math.max(0, ...app.list.map(x => x.id)) + 1;

      app.list.push({
        id,
        content: this.value.trim(),
        selected: false,
        done: false,
        archieved: false,
      });

      app.list = app.list.sort((a, b) => b.id - a.id);
      this.value = '';
      app.update();
    });

    if (localStorage.getItem('application')) {
      this.list = JSON.parse(localStorage.getItem('application'));
    } else {
      this.list = [];
    }

    // this.list = [
    //   { id: 5, content: 'Помыть машину', selected: false, done: false, archieved: false },
    //   { id: 4, content: 'Сделать ДЗ', selected: false, done: false, archieved: false },
    //   { id: 3, content: 'Купить подарок', selected: false, done: false, archieved: false },
    //   { id: 2, content: 'Купить молоко', selected: false, done: false, archieved: false },
    //   { id: 1, content: 'Купить хлеб', selected: false, done: false, archieved: false },
    // ];

    const panelElem = this.el.querySelector('[data-panel]');
    panelElem.querySelector('[data-disable="done"]').addEventListener('click', () => {
      for (const item of this.list) {
        if (item.selected) {
          item.done = !item.done;
          item.selected = !item.selected;
        }
      }
      this.update();
    });

    panelElem.querySelector('[data-disable="archive"]').addEventListener('click', () => {
      for (const item of this.list) {
        if (item.selected) {
          item.archieved = !item.archieved;
          item.selected = !item.selected;
        }
      }
      this.update();
    });

    this.update();
    this.getBasicDOM();
  }

  get someSelected() {
    return this.items.some(item => item.selected);
  }

  get items() {
    return this.list.filter(item => !item.archieved);
  }

  update() {
    const app = this;
    const ulElement = this.el.querySelector('[data-items]');

    localStorage.setItem('application', JSON.stringify(this.list));

    ulElement.innerHTML = '';

    for (const item of this.items) {
      const liElement = this.getItemDOM(item);

      if (item.selected) {
        liElement.classList.add('active');
      }

      if (item.done) {
        liElement.querySelector('span').classList.add('done');
      }
      ulElement.append(liElement);

      liElement.addEventListener('click', function (event) {
        const target = event.target;

        if (target.classList.contains('btn')) {
          const action = target.getAttribute('data-button');

          if (action === 'archive') {
            item.archieved = !item.archieved;
            app.update();
          } else if (action === 'done') {
            item.done = !item.done;
            app.update();
          }
        } else {
          item.selected = !item.selected;

          app.update();
        }
      });
    }

    const panelElem = this.el.querySelector('[data-panel]');
    const panelBtns = panelElem.querySelectorAll('[data-disable]');

    panelBtns.forEach(elem => {
      elem.setAttribute('disabled', 'disabled');
    });

    if (this.someSelected) {
      panelBtns.forEach(elem => {
        elem.removeAttribute('disabled');
      });
    }
  }

  getItemDOM(item) {
    let liElement = document.createElement('li');

    liElement.innerHTML = `
      <li class='task'>
        <span class="task__text">${item.content}.</span>
        <div class="btns-group header___btns" ${
          this.someSelected ? 'style=visibility:hidden;' : ''
        }>
          <button class="btn btn-reset btn--archive" data-button="archive">Archive</button>
          <button class="btn btn-reset btn--done"  data-button="done">Done</button>
        </div>
      </li>
    `;
    liElement.classList.add('task');

    return liElement.firstElementChild;
  }

  getBasicDOM() {
    const app = this;
    let divElement = document.createElement('div');
    divElement.innerHTML = `
        <div class="container">
          <div class="header">
            <input type="text" class="header__input" placeholder="Type and press enter" />
            <div class="btns-group header___btns" data-panel>
              <button class="btn btn-reset btn--first" data-disable="archive">В корзину</button>
              <button class="btn btn-reset btn--second" data-disable="done">Сделано!</button>
            </div>
          </div>
          <div class="main">
            <ul class="list-reset tasks-list" data-items>
              
            </ul>
          </div>
      </div> 
    `;
    return divElement.firstElementChild;
  }
}
