import { Book } from "../models/Book";
import { User } from "../models/User";
import { Library } from "../services/Library";
import { StorageService } from "../services/Storage";
import { Validation } from "../utils/validators";

export class AppUI {
  private bookLib: Library<Book>;
  private userLib: Library<User>;
  private appContainer!: HTMLElement;

  private currentBookPage: number = 1;
  private readonly pageSize: number = 5;
  private bookSearchQuery: string = "";

  constructor() {
    const savedBooks = StorageService.get<Book[]>("books") || [
      new Book("1", "Code Complete", "Steve McConnell", 2004),
      new Book(
        "2",
        "Clean Code: A Handbook of Agile Software Craftsmanship",
        "Роберт Мартін",
        2008,
      ),
      new Book(
        "3",
        "The Pragmatic Programmer: Your Journey to Mastery",
        "Ендрю Хансон, Девід Томас",
        1999,
      ),
    ];

    const savedUsers = StorageService.get<User[]>("users") || [
      new User("1725533394038", "Артем", "artemkarachevtsev@gmail.com", 0),
      new User("1725533437798", "Мартін", "softwar@gmail.com", 0),
    ];

    this.bookLib = new Library<Book>(
      savedBooks.map(
        (b) =>
          new Book(b.id, b.title, b.author, b.year, b.isBorrowed, b.borrowedBy),
      ),
    );
    this.userLib = new Library<User>(
      savedUsers.map(
        (u) => new User(u.id, u.name, u.email, u.borrowedBooksCount),
      ),
    );
  }

  public init(): void {
    let container = document.getElementById("app");
    if (!container) {
      container = document.createElement("div");
      container.id = "app";
      document.body.appendChild(container);
    }
    this.appContainer = container;
    this.render();
  }

  private saveState(): void {
    StorageService.save("books", this.bookLib.getAll());
    StorageService.save("users", this.userLib.getAll());
  }

  private render(): void {
    if (!this.appContainer) {
      this.appContainer = document.getElementById("app") || document.body;
    }
    this.appContainer.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.className = "container py-4";
    wrapper.style.maxWidth = "850px";

    const header = document.createElement("h3");
    header.className = "text-center fw-bold mb-4";
    header.textContent = "Система Управління Бібліотекою";
    wrapper.appendChild(header);

    wrapper.appendChild(this.createBookFormSection());
    wrapper.appendChild(this.createUserFormSection());
    wrapper.appendChild(this.createBookListSection());
    wrapper.appendChild(this.createUserListSection());

    this.appContainer.appendChild(wrapper);
  }

  private createBookFormSection(): HTMLElement {
    const card = document.createElement("div");
    card.className = "card shadow-sm mb-4 border-0";

    const body = document.createElement("div");
    body.className = "card-body p-4";

    const title = document.createElement("h5");
    title.className = "card-title fw-bold mb-3";
    title.textContent = "Додати Книгу";

    const form = document.createElement("form");

    const titleGroup = this.createInputGroup("bookTitle", "Назва книги");
    const authorGroup = this.createInputGroup("bookAuthor", "Автор");
    const yearGroup = this.createInputGroup("bookYear", "Рік видання");

    const btn = document.createElement("button");
    btn.type = "submit";
    btn.className = "btn btn-success px-4 mt-2";
    btn.textContent = "Додати Книгу";

    form.append(titleGroup.group, authorGroup.group, yearGroup.group, btn);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let isValid = true;

      [titleGroup, authorGroup, yearGroup].forEach((g) => g.clearError());

      if (!Validation.isRequired(titleGroup.input.value)) {
        titleGroup.showError("Це поле є обов'язковим");
        isValid = false;
      }
      if (!Validation.isRequired(authorGroup.input.value)) {
        authorGroup.showError("Це поле є обов'язковим");
        isValid = false;
      }
      if (!Validation.isRequired(yearGroup.input.value)) {
        yearGroup.showError("Це поле є обов'язковим");
        isValid = false;
      } else if (!Validation.isValidYear(yearGroup.input.value)) {
        yearGroup.showError("Введіть коректний чотиризначний рік видання");
        isValid = false;
      }

      if (isValid) {
        const newBook = new Book(
          Date.now().toString(),
          titleGroup.input.value.trim(),
          authorGroup.input.value.trim(),
          parseInt(yearGroup.input.value.trim(), 10),
        );
        this.bookLib.add(newBook);
        this.saveState();
        this.render();
      }
    });

    body.append(title, form);
    card.appendChild(body);
    return card;
  }

  private createUserFormSection(): HTMLElement {
    const card = document.createElement("div");
    card.className = "card shadow-sm mb-4 border-0";

    const body = document.createElement("div");
    body.className = "card-body p-4";

    const title = document.createElement("h5");
    title.className = "card-title fw-bold mb-3";
    title.textContent = "Додати Користувача";

    const form = document.createElement("form");

    const nameGroup = this.createInputGroup("userName", "Ім'я");
    const emailGroup = this.createInputGroup("userEmail", "Email");

    const btn = document.createElement("button");
    btn.type = "submit";
    btn.className = "btn btn-success px-4 mt-2";
    btn.textContent = "Додати Користувача";

    form.append(nameGroup.group, emailGroup.group, btn);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let isValid = true;

      [nameGroup, emailGroup].forEach((g) => g.clearError());

      if (!Validation.isRequired(nameGroup.input.value)) {
        nameGroup.showError("Це поле є обов'язковим");
        isValid = false;
      }
      if (!Validation.isRequired(emailGroup.input.value)) {
        emailGroup.showError("Це поле є обов'язковим");
        isValid = false;
      } else if (!Validation.isValidEmail(emailGroup.input.value)) {
        emailGroup.showError("Введіть коректний email");
        isValid = false;
      }

      if (isValid) {
        const newUser = new User(
          Date.now().toString(),
          nameGroup.input.value.trim(),
          emailGroup.input.value.trim(),
          0,
        );
        this.userLib.add(newUser);
        this.saveState();
        this.render();
      }
    });

    body.append(title, form);
    card.appendChild(body);
    return card;
  }

  private createBookListSection(): HTMLElement {
    const card = document.createElement("div");
    card.className = "card shadow-sm mb-4 border-0";

    const body = document.createElement("div");
    body.className = "card-body p-4";

    const title = document.createElement("h5");
    title.className = "card-title fw-bold mb-3";
    title.textContent = "Список Книг";

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.className = "form-control mb-3";
    searchInput.placeholder = "Пошук книг за назвою або автором...";
    searchInput.value = this.bookSearchQuery;

    // Окремі контейнери під список та пагінацію
    const listGroup = document.createElement("div");
    listGroup.className = "list-group list-group-flush mb-3";

    const paginationContainer = document.createElement("div");

    // Функція локального оновлення лише книг без скидання фокусу
    const updateBooksDisplay = () => {
      listGroup.innerHTML = "";
      paginationContainer.innerHTML = "";

      const allBooks = this.bookLib.getAll();
      const filtered = allBooks.filter(
        (b) =>
          b.title.toLowerCase().includes(this.bookSearchQuery.toLowerCase()) ||
          b.author.toLowerCase().includes(this.bookSearchQuery.toLowerCase()),
      );

      const totalPages = Math.ceil(filtered.length / this.pageSize) || 1;
      if (this.currentBookPage > totalPages) this.currentBookPage = totalPages;

      const startIdx = (this.currentBookPage - 1) * this.pageSize;
      const paginatedBooks = filtered.slice(startIdx, startIdx + this.pageSize);

      if (paginatedBooks.length === 0) {
        const empty = document.createElement("div");
        empty.className = "text-muted py-2";
        empty.textContent = "Книг не знайдено";
        listGroup.appendChild(empty);
      } else {
        paginatedBooks.forEach((book) => {
          const item = document.createElement("div");
          item.className =
            "list-group-item d-flex justify-content-between align-items-center px-0 py-3 border-bottom";

          const info = document.createElement("div");
          info.textContent = `${book.title} by ${book.author} (${book.year})`;
          if (book.isBorrowed) {
            const badge = document.createElement("span");
            badge.className = "badge bg-secondary ms-2";
            badge.textContent = `Видано (ID: ${book.borrowedBy})`;
            info.appendChild(badge);
          }

          const btnGroup = document.createElement("div");

          const actionBtn = document.createElement("button");
          if (book.isBorrowed) {
            actionBtn.className = "btn btn-warning btn-sm me-2";
            actionBtn.textContent = "Повернути";
            actionBtn.addEventListener("click", () =>
              this.handleReturnBook(book),
            );
          } else {
            actionBtn.className = "btn btn-primary btn-sm me-2";
            actionBtn.textContent = "Позичити";
            actionBtn.addEventListener("click", () =>
              this.handleBorrowBook(book),
            );
          }

          const deleteBtn = document.createElement("button");
          deleteBtn.className = "btn btn-outline-danger btn-sm";
          deleteBtn.textContent = "✕";
          deleteBtn.title = "Видалити книгу";
          deleteBtn.addEventListener("click", () => {
            this.bookLib.remove(book.id);
            this.saveState();
            this.render();
          });

          btnGroup.append(actionBtn, deleteBtn);
          item.append(info, btnGroup);
          listGroup.appendChild(item);
        });
      }

      const pagination = this.createPagination(
        totalPages,
        this.currentBookPage,
        (page) => {
          this.currentBookPage = page;
          updateBooksDisplay();
        },
      );

      paginationContainer.appendChild(pagination);
    };

    searchInput.addEventListener("input", (e) => {
      this.bookSearchQuery = (e.target as HTMLInputElement).value;
      this.currentBookPage = 1;
      updateBooksDisplay();
    });

    updateBooksDisplay();

    body.append(title, searchInput, listGroup, paginationContainer);
    card.appendChild(body);
    return card;
  }

  private createUserListSection(): HTMLElement {
    const card = document.createElement("div");
    card.className = "card shadow-sm mb-4 border-0";

    const body = document.createElement("div");
    body.className = "card-body p-4";

    const title = document.createElement("h5");
    title.className = "card-title fw-bold mb-3";
    title.textContent = "Список Користувачів";

    const listGroup = document.createElement("div");
    listGroup.className = "list-group list-group-flush";

    const users = this.userLib.getAll();
    if (users.length === 0) {
      const empty = document.createElement("div");
      empty.className = "text-muted py-2";
      empty.textContent = "Користувачів немає";
      listGroup.appendChild(empty);
    } else {
      users.forEach((user) => {
        const item = document.createElement("div");
        item.className =
          "list-group-item d-flex justify-content-between align-items-center px-0 py-3 border-bottom";

        const text = document.createElement("div");
        text.textContent = `${user.id} ${user.name} (${user.email})`;

        const rightSide = document.createElement("div");

        const countBadge = document.createElement("span");
        countBadge.className = "badge bg-info text-dark me-2";
        countBadge.textContent = `Книг: ${user.borrowedBooksCount}/3`;

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn btn-outline-danger btn-sm";
        deleteBtn.textContent = "✕";
        deleteBtn.title = "Видалити користувача";
        deleteBtn.addEventListener("click", () => {
          this.userLib.remove(user.id);
          this.saveState();
          this.render();
        });

        rightSide.append(countBadge, deleteBtn);
        item.append(text, rightSide);
        listGroup.appendChild(item);
      });
    }

    body.append(title, listGroup);
    card.appendChild(body);
    return card;
  }

  private handleBorrowBook(book: Book): void {
    this.showPromptModal(
      "Введіть ID користувача для позичення книги:",
      (enteredId) => {
        if (!enteredId || !Validation.isNumeric(enteredId)) {
          this.showInfoModal(
            "Помилка",
            "Введіть коректний числовий ID користувача!",
          );
          return;
        }

        const user = this.userLib.findById(enteredId.trim());
        if (!user) {
          this.showInfoModal(
            "Помилка",
            `Користувача з ID ${enteredId} не знайдено.`,
          );
          return;
        }

        if (user.borrowedBooksCount >= 3) {
          this.showInfoModal(
            "Ліміт вичерпано",
            `Користувач ${user.name} вже позичив максимум 3 книги!`,
          );
          return;
        }

        book.borrow(user.id);
        user.incrementBorrowed();
        this.saveState();
        this.render();

        this.showInfoModal(
          "Успішно",
          `${book.title} (${book.year}) has been borrowed by ${user.id} ${user.name} (${user.email}).`,
          "Зрозуміло!",
        );
      },
    );
  }

  private handleReturnBook(book: Book): void {
    if (book.borrowedBy) {
      const user = this.userLib.findById(book.borrowedBy);
      if (user) {
        user.decrementBorrowed();
      }
    }

    book.returnBook();
    this.saveState();
    this.render();

    this.showInfoModal(
      "Успішно",
      `${book.title} (${book.year}) has been returned.`,
      "Закрити",
    );
  }

  private createInputGroup(
    id: string,
    placeholder: string,
  ): {
    group: HTMLElement;
    input: HTMLInputElement;
    showError: (msg: string) => void;
    clearError: () => void;
  } {
    const group = document.createElement("div");
    group.className = "mb-3";

    const input = document.createElement("input");
    input.type = "text";
    input.className = "form-control";
    input.placeholder = placeholder;

    const errorMsg = document.createElement("div");
    errorMsg.className = "text-danger small mt-1";
    errorMsg.style.display = "none";

    group.append(input, errorMsg);

    return {
      group,
      input,
      showError: (msg: string) => {
        errorMsg.textContent = msg;
        errorMsg.style.display = "block";
        input.classList.add("is-invalid");
      },
      clearError: () => {
        errorMsg.textContent = "";
        errorMsg.style.display = "none";
        input.classList.remove("is-invalid");
      },
    };
  }

  private createPagination(
    totalPages: number,
    currentPage: number,
    onPageChange: (p: number) => void,
  ): HTMLElement {
    const nav = document.createElement("nav");
    if (totalPages <= 1) return nav;

    const ul = document.createElement("ul");
    ul.className = "pagination pagination-sm justify-content-center mb-0 mt-3";

    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement("li");
      li.className = `page-item ${i === currentPage ? "active" : ""}`;

      const a = document.createElement("a");
      a.className = "page-link";
      a.href = "#";
      a.textContent = i.toString();
      a.addEventListener("click", (e) => {
        e.preventDefault();
        onPageChange(i);
      });

      li.appendChild(a);
      ul.appendChild(li);
    }

    nav.appendChild(ul);
    return nav;
  }

  private showPromptModal(
    title: string,
    onConfirm: (val: string) => void,
  ): void {
    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop fade show";

    const modal = document.createElement("div");
    modal.className = "modal fade show d-block";
    modal.tabIndex = -1;

    modal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header">
            <h6 class="modal-title fw-bold">${title}</h6>
            <button type="button" class="btn-close" id="modalCloseBtn"></button>
          </div>
          <div class="modal-body">
            <input type="text" class="form-control" id="modalPromptInput" placeholder="ID">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="modalCancelBtn">Скасувати</button>
            <button type="button" class="btn btn-primary" id="modalSaveBtn">Зберегти</button>
          </div>
        </div>
      </div>
    `;

    document.body.append(backdrop, modal);

    const close = () => {
      backdrop.remove();
      modal.remove();
    };

    modal.querySelector("#modalCloseBtn")?.addEventListener("click", close);
    modal.querySelector("#modalCancelBtn")?.addEventListener("click", close);

    modal.querySelector("#modalSaveBtn")?.addEventListener("click", () => {
      const input = modal.querySelector(
        "#modalPromptInput",
      ) as HTMLInputElement;
      const value = input.value;
      close();
      onConfirm(value);
    });
  }

  private showInfoModal(
    title: string,
    message: string,
    btnText: string = "Зрозуміло!",
  ): void {
    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop fade show";

    const modal = document.createElement("div");
    modal.className = "modal fade show d-block";
    modal.tabIndex = -1;

    modal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-body py-4">
            <p class="mb-0 text-muted fs-6">${message}</p>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-primary" id="modalOkBtn">${btnText}</button>
          </div>
        </div>
      </div>
    `;

    document.body.append(backdrop, modal);

    const close = () => {
      backdrop.remove();
      modal.remove();
    };

    modal.querySelector("#modalOkBtn")?.addEventListener("click", close);
  }
}
