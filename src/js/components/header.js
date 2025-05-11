export class HeaderComponent {
  constructor(container) {
    this.container = container;
    this.title = 'Dashboard';
    this.render();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="header-left">
        <button class="sidebar-toggle btn btn-secondary btn-sm">
          <i class="fas fa-bars"></i>
        </button>
        <h1 class="header-title">${this.title}</h1>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary">
          <i class="fas fa-calendar-alt"></i>
          Last 30 days
        </button>
        <button class="btn btn-primary">
          <i class="fas fa-plus"></i>
          Add Event
        </button>
        <button class="theme-toggle btn btn-secondary">
          <i class="fas fa-moon"></i>
        </button>
      </div>
    `;
  }
  
  setTitle(title) {
    this.title = title;
    const titleElement = this.container.querySelector('.header-title');
    if (titleElement) {
      titleElement.textContent = title;
    }
  }
}