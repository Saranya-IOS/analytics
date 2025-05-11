export class Router {
  constructor(routes, container) {
    this.routes = routes;
    this.container = container;
    this.onRouteChange = null;
    
    // Listen for hash changes
    window.addEventListener('hashchange', () => {
      this.handleRouteChange();
    });
  }
  
  handleRouteChange() {
    const path = window.location.hash.slice(1) || '/';
    this.navigateTo(path);
  }
  
  navigateTo(path) {
    // Find the matching route
    const route = this.routes.find(r => r.path === path) || this.routes.find(r => r.path === '/');
    
    if (route) {
      // Clear the container
      this.container.innerHTML = '';
      
      // Create and render the page component
      const page = new route.component(this.container);
      page.render();
      
      // Update the URL hash if necessary
      if (window.location.hash.slice(1) !== path) {
        window.location.hash = path;
      }
      
      // Call the route change callback if set
      if (this.onRouteChange) {
        this.onRouteChange(path);
      }
    }
  }
}