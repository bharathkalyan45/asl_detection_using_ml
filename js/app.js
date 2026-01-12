// Main App Controller
class ASLApp {
    constructor() {
        this.currentTab = 'upload';
        this.init();
    }

    init() {
        this.setupTabNavigation();
        this.setupEventListeners();
        console.log('ASL Recognition App Initialized');
    }

    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabName = button.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });
    }

    switchTab(tabName) {
        this.currentTab = tabName;

        // Update button states
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-tab') === tabName) {
                btn.classList.add('active');
            }
        });

        // Update content visibility
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        const activeContent = document.getElementById(`${tabName}-tab`);
        if (activeContent) {
            activeContent.classList.add('active');
        }
    }

    setupEventListeners() {
        // Global escape key handling
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Could be used for cleanup
            }
        });
    }

    showLoading(show = true) {
        const spinner = document.getElementById('loadingSpinner');
        if (show) {
            spinner.style.display = 'flex';
        } else {
            spinner.style.display = 'none';
        }
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ASLApp();
});
