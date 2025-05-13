import { AnalyticsApi } from '../api/analyticsApi.js';

export class FunnelPage {
  constructor(container) {
    this.container = container;
    this.funnelData = [];
    this.funnelSteps = ['page_view', 'signup', 'purchase'];
  }
  
  async render() {
    this.showLoading();
    
    try {
      await this.loadFunnelData();
      this.renderFunnelPage();
    } catch (error) {
      this.showError(error.message);
    }
  }
  
  async loadFunnelData() {
    this.funnelData = await AnalyticsApi.getFunnelData(this.funnelSteps);
  }
  
  showLoading() {
    this.container.innerHTML = `
      <div class="dashboard">
        <div class="loading-spinner"></div>
        <p>Loading funnel data...</p>
      </div>
    `;
  }
  
  showError(message) {
    this.container.innerHTML = `
      <div class="dashboard">
        <div class="card" style="text-align: center; color: var(--color-error-600);">
          <h3>Error Loading Funnel Data</h3>
          <p>${message}</p>
          <button class="btn btn-primary" id="retry-button">
            <i class="fas fa-redo"></i> Retry
          </button>
        </div>
      </div>
    `;
    
    document.getElementById('retry-button').addEventListener('click', () => {
      this.render();
    });
  }
  
  renderFunnelPage() {
    this.container.innerHTML = `
      <div class="dashboard fade-in">
        <div class="dashboard-header">
          <h1>Funnel Analysis</h1>
          <p>Track user progression through critical conversion paths</p>
        </div>
        
        <div class="card slide-up">
          <div class="card-header">
            <div class="card-title">Customize Funnel</div>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: var(--space-4); margin-bottom: var(--space-4);">
            <div class="form-group" style="flex: 1; min-width: 200px;">
              <label class="form-label">Funnel Steps</label>
              <div id="funnel-steps-container" style="display: flex; flex-direction: column; gap: var(--space-2);">
                <div class="funnel-step-item" style="display: flex; align-items: center; gap: var(--space-2);">
                  <select class="form-select" data-step-index="0">
                    <option value="page_view" selected>Page View</option>
                    <option value="button_click">Button Click</option>
                    <option value="signup">Signup</option>
                    <option value="login">Login</option>
                    <option value="purchase">Purchase</option>
                    <option value="share">Share</option>
                  </select>
                </div>
                <div class="funnel-step-item" style="display: flex; align-items: center; gap: var(--space-2);">
                  <select class="form-select" data-step-index="1">
                    <option value="page_view">Page View</option>
                    <option value="button_click">Button Click</option>
                    <option value="signup" selected>Signup</option>
                    <option value="login">Login</option>
                    <option value="purchase">Purchase</option>
                    <option value="share">Share</option>
                  </select>
                </div>
                <div class="funnel-step-item" style="display: flex; align-items: center; gap: var(--space-2);">
                  <select class="form-select" data-step-index="2">
                    <option value="page_view">Page View</option>
                    <option value="button_click">Button Click</option>
                    <option value="signup">Signup</option>
                    <option value="login">Login</option>
                    <option value="purchase" selected>Purchase</option>
                    <option value="share">Share</option>
                  </select>
                </div>
              </div>
              <div style="margin-top: var(--space-2);">
                <button class="btn btn-secondary btn-sm" id="add-step-btn">
                  <i class="fas fa-plus"></i> Add Step
                </button>
              </div>
            </div>
            
            <div class="form-group" style="flex: 1; min-width: 200px;">
              <label class="form-label">Date Range</label>
              <select class="form-select">
                <option value="7">Last 7 days</option>
                <option value="30" selected>Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          </div>
          
          <div style="display: flex; justify-content: flex-end;">
            <button class="btn btn-primary" id="update-funnel-btn">
              <i class="fas fa-sync-alt"></i> Update Funnel
            </button>
          </div>
        </div>
        
        <div class="card slide-up">
          <div class="card-header">
            <div class="card-title">Conversion Funnel</div>
            <div class="card-actions">
              <button class="btn btn-secondary btn-sm">
                <i class="fas fa-download"></i> Export
              </button>
            </div>
          </div>
          <div class="funnel-container" id="funnel-visualization"></div>
        </div>
        
        <div class="card slide-up">
          <div class="card-header">
            <div class="card-title">Funnel Insights</div>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--space-6);">
            <div>
              <h4 style="margin-bottom: var(--space-4);">Overall Conversion Rate</h4>
              <div id="overall-conversion" style="font-size: 3rem; font-weight: var(--font-bold); color: var(--color-primary-600); margin-bottom: var(--space-2);"></div>
              <p style="color: var(--color-gray-600);">From first to last step</p>
            </div>
            
            <div>
              <h4 style="margin-bottom: var(--space-4);">Biggest Drop-off</h4>
              <div id="biggest-dropoff" style="font-size: 1.25rem; font-weight: var(--font-medium); margin-bottom: var(--space-2);"></div>
              <div id="dropoff-percentage" style="font-size: 2rem; font-weight: var(--font-bold); color: var(--color-error-600); margin-bottom: var(--space-2);"></div>
              <p style="color: var(--color-gray-600);">Lost conversion</p>
            </div>
            
            <div>
              <h4 style="margin-bottom: var(--space-4);">Recommendations</h4>
              <ul style="list-style: disc; margin-left: var(--space-4); color: var(--color-gray-700);">
                <li style="margin-bottom: var(--space-2);">Optimize the step with the biggest drop-off</li>
                <li style="margin-bottom: var(--space-2);">Compare conversion rates across different segments</li>
                <li style="margin-bottom: var(--space-2);">Test variations of the critical steps</li>
                <li style="margin-bottom: var(--space-2);">Consider shortening your funnel if possible</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
    
    this.renderFunnelVisualization();
    this.updateFunnelInsights();
    this.addEventListeners();
  }
  
  renderFunnelVisualization() {
    const container = document.getElementById('funnel-visualization');
    
    // Get the maximum count for scaling
    const maxCount = Math.max(...this.funnelData.map(step => step.count));
    
    // Create HTML for the funnel visualization
    let html = '';
    
    this.funnelData.forEach((step, index) => {
      const widthPercentage = (step.count / maxCount) * 100;
      const stepName = step.step.charAt(0).toUpperCase() + step.step.slice(1).replace('_', ' ');
      
      html += `
        <div class="funnel-step">
          <div class="funnel-label">${stepName}</div>
          <div class="funnel-bar-container">
            <div class="funnel-bar" style="width: ${widthPercentage}%"></div>
            <div class="funnel-value">${step.count}</div>
          </div>
          <div class="funnel-conversion">
            ${index > 0 ? `${step.conversion_rate.toFixed(1)}%` : ''}
          </div>
        </div>
      `;
      
      // Add arrow between steps (except after the last step)
      if (index < this.funnelData.length - 1) {
        html += `<div class="funnel-arrow"><i class="fas fa-chevron-down"></i></div>`;
      }
    });
    
    container.innerHTML = html;
  }
  
  updateFunnelInsights() {
    // Calculate overall conversion rate
    const firstStep = this.funnelData[0];
    const lastStep = this.funnelData[this.funnelData.length - 1];
    const overallConversion = (lastStep.count / firstStep.count) * 100;
    
    document.getElementById('overall-conversion').textContent = `${overallConversion.toFixed(1)}%`;
    
    // Find biggest drop-off
    let biggestDropoff = { stepIndex: -1, dropPercentage: 0 };
    
    for (let i = 1; i < this.funnelData.length; i++) {
      const previousStep = this.funnelData[i - 1];
      const currentStep = this.funnelData[i];
      const dropPercentage = 100 - currentStep.conversion_rate;
      
      if (dropPercentage > biggestDropoff.dropPercentage) {
        biggestDropoff.stepIndex = i;
        biggestDropoff.dropPercentage = dropPercentage;
      }
    }
    
    if (biggestDropoff.stepIndex !== -1) {
      const fromStep = this.funnelData[biggestDropoff.stepIndex - 1].step.charAt(0).toUpperCase() + 
                      this.funnelData[biggestDropoff.stepIndex - 1].step.slice(1).replace('_', ' ');
      const toStep = this.funnelData[biggestDropoff.stepIndex].step.charAt(0).toUpperCase() + 
                    this.funnelData[biggestDropoff.stepIndex].step.slice(1).replace('_', ' ');
      
      document.getElementById('biggest-dropoff').textContent = `${fromStep} → ${toStep}`;
      document.getElementById('dropoff-percentage').textContent = `${biggestDropoff.dropPercentage.toFixed(1)}%`;
    }
  }
  
  addEventListeners() {
    // Update funnel button
    document.getElementById('update-funnel-btn').addEventListener('click', async () => {
      // Get selected steps
      const stepSelects = document.querySelectorAll('[data-step-index]');
      this.funnelSteps = Array.from(stepSelects).map(select => select.value);
      
      this.showLoading();
      
      try {
        await this.loadFunnelData();
        this.renderFunnelPage();
      } catch (error) {
        this.showError(error.message);
      }
    });
    
    // Add step button
    document.getElementById('add-step-btn').addEventListener('click', () => {
      const stepsContainer = document.getElementById('funnel-steps-container');
      const newStepIndex = stepsContainer.children.length;
      
      // Create new step item
      const stepItem = document.createElement('div');
      stepItem.className = 'funnel-step-item';
      stepItem.style.display = 'flex';
      stepItem.style.alignItems = 'center';
      stepItem.style.gap = 'var(--space-2)';
      
      stepItem.innerHTML = `
        <select class="form-select" data-step-index="${newStepIndex}">
          <option value="page_view">Page View</option>
          <option value="button_click">Button Click</option>
          <option value="signup">Signup</option>
          <option value="login">Login</option>
          <option value="purchase">Purchase</option>
          <option value="share">Share</option>
        </select>
        <button class="btn btn-secondary btn-sm remove-step-btn">
          <i class="fas fa-times"></i>
        </button>
      `;
      
      stepsContainer.appendChild(stepItem);
      
      // Add event listener to remove button
      stepItem.querySelector('.remove-step-btn').addEventListener('click', () => {
        stepsContainer.removeChild(stepItem);
        
        // Update step indices
        const stepSelects = stepsContainer.querySelectorAll('[data-step-index]');
        stepSelects.forEach((select, index) => {
          select.dataset.stepIndex = index;
        });
      });
    });
  }
}