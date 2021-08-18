class Application {
  constructor(param) {
    this.el = param.el;
    this.el.innerHTML = '';
    this.el.append(this.getBasicDOM());

    this.list = [
      { id: 1, content: 'Купить хлеб', selected: false, done: false },
      { id: 2, content: 'Купить молоко', selected: false, done: true },
      { id: 3, content: 'Купить подарок', selected: false, done: true },
      { id: 4, content: 'Сделать ДЗ', selected: false, done: false },
      { id: 5, content: 'Помыть машину', selected: false, done: false },
    ];

    this.update();
    this.getBasicDOM();
  }

  update() {
    const app = this;
    const ulElement = this.el.querySelector('[data-items]');
    ulElement.innerHTML = '';

    for (const item of this.list) {
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
          } else if (action === 'done') {
            item.done = !item.done;
            app.update();
          }
        } else {
          item.selected = !item.selected;
          app.update();
        }
        // this.classList.add('active');
        // console.log(this.list);
      });
    }
  }

  getItemDOM(item) {
    let liElement = document.createElement('li');

    liElement.innerHTML = `
      <li class='task'>
        <span class="task__text">${item.content}.</span>
        <div class="btns-group header___btns">
          <button class="btn btn-reset btn--archive" data-button="archive">Archive</button>
          <button class="btn btn-reset btn--done"  data-button="done">Done</button>
        </div>
      </li>
    `;
    liElement.classList.add('task');

    return liElement.firstElementChild;
  }

  getBasicDOM() {
    let divElement = document.createElement('div');
    divElement.innerHTML = `
        <div class="container">
          <div class="header">
            <input type="text" class="header__input" placeholder="Ещё одна задача..." />
            <div class="btns-group header___btns">
              <button class="btn btn-reset btn--first" disabled="true">В корзину</button>
              <button class="btn btn-reset btn--second" disabled="true">Сделано!</button>
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
