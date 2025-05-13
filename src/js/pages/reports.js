export class ReportsPage {
  constructor(container) {
    this.container = container;
  }
  
  render() {
    this.container.innerHTML = `
      <div class="dashboard fade-in">
        <div class="dashboard-header">
          <h1>Reports</h1>
          <p>Create and manage custom analytics reports</p>
        </div>
        
        <div class="card slide-up">
          <div class="card-header">
            <div class="card-title">Saved Reports</div>
            <div class="card-actions">
              <button class="btn btn-primary">
                <i class="fas fa-plus"></i> New Report
              </button>
            </div>
          </div>
          
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Report Name</th>
                  <th>Type</th>
                  <th>Created</th>
                  <th>Last Modified</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Monthly User Acquisition</td>
                  <td><span class="badge badge-primary">User</span></td>
                  <td>Aug 12, 2025</td>
                  <td>Aug 15, 2025</td>
                  <td>
                    <button class="btn btn-secondary btn-sm">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-secondary btn-sm">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-secondary btn-sm">
                      <i class="fas fa-download"></i>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>Conversion Optimization</td>
                  <td><span class="badge badge-primary">Funnel</span></td>
                  <td>Aug 5, 2025</td>
                  <td>Aug 14, 2025</td>
                  <td>
                    <button class="btn btn-secondary btn-sm">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-secondary btn-sm">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-secondary btn-sm">
                      <i class="fas fa-download"></i>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>Revenue Analytics</td>
                  <td><span class="badge badge-primary">Event</span></td>
                  <td>Jul 28, 2025</td>
                  <td>Aug 10, 2025</td>
                  <td>
                    <button class="btn btn-secondary btn-sm">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-secondary btn-sm">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-secondary btn-sm">
                      <i class="fas fa-download"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div class="card slide-up">
          <div class="card-header">
            <div class="card-title">Report Templates</div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--space-6); margin-top: var(--space-4);">
            <div class="card" style="margin-bottom: 0;">
              <h4>User Retention</h4>
              <p style="color: var(--color-gray-600); margin: var(--space-2) 0 var(--space-4) 0;">
                Track how many users continue to use your product over time.
              </p>
              <button class="btn btn-primary">Use Template</button>
            </div>
            
            <div class="card" style="margin-bottom: 0;">
              <h4>Event Frequency</h4>
              <p style="color: var(--color-gray-600); margin: var(--space-2) 0 var(--space-4) 0;">
                Analyze how often users perform key actions in your product.
              </p>
              <button class="btn btn-primary">Use Template</button>
            </div>
            
            <div class="card" style="margin-bottom: 0;">
              <h4>Conversion by Segment</h4>
              <p style="color: var(--color-gray-600); margin: var(--space-2) 0 var(--space-4) 0;">
                Compare conversion rates across different user segments.
              </p>
              <button class="btn btn-primary">Use Template</button>
            </div>
            
            <div class="card" style="margin-bottom: 0;">
              <h4>User Journey</h4>
              <p style="color: var(--color-gray-600); margin: var(--space-2) 0 var(--space-4) 0;">
                Map the typical paths users take through your product.
              </p>
              <button class="btn btn-primary">Use Template</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}