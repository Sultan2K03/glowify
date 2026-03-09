/**
 * Osscent Admin Main JavaScript
 * Handles common functionality across all admin pages
 */

(function($) {
    'use strict';

    // Initialize when DOM is ready
    $(document).ready(function() {
        
        // Set active nav link based on current page
        setActiveNavLink();
        
        // Initialize all DataTables
        initializeDataTables();
        
        // Initialize tooltips
        initializeTooltips();
        
        // Handle responsive tables
        handleResponsiveTables();
        
        // Initialize form validations (if forms exist)
        initializeFormValidation();
    });


    // Desktop toggle (collapse icons-only)
        const sidebar = document.getElementById('sidebar');
        const main    = document.getElementById('main');
        const overlay = document.getElementById('overlay');

        $('#menuToggle').on('click', function () {
            if (window.innerWidth <= 768) {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('show');
            } else {
            sidebar.classList.toggle('collapsed');
            main.classList.toggle('expanded');
            }
        });

        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('show');
        });
        
    /**
     * Set active navigation link based on current page URL
     */
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        $('.navbar-nav .nav-link').each(function() {
            const linkHref = $(this).attr('href');
            if (linkHref === currentPage) {
                $(this).addClass('active');
            } else {
                $(this).removeClass('active');
            }
        });
    }

    /**
     * Initialize all DataTables on the page
     */
    function initializeDataTables() {
        // Common DataTables configuration
        const commonConfig = {
            dom: '<"row"<"col-md-6"B><"col-md-6"f>>rtip',
            buttons: [
                {
                    extend: 'copy',
                    text: '<i class="fa-regular fa-copy"></i> Copy',
                    className: 'btn btn-sm'
                },
                {
                    extend: 'csv',
                    text: '<i class="fa-regular fa-file-csv"></i> CSV',
                    className: 'btn btn-sm'
                },
                {
                    extend: 'excel',
                    text: '<i class="fa-regular fa-file-excel"></i> Excel',
                    className: 'btn btn-sm'
                },
                {
                    extend: 'pdf',
                    text: '<i class="fa-regular fa-file-pdf"></i> PDF',
                    className: 'btn btn-sm'
                },
                {
                    extend: 'print',
                    text: '<i class="fa-regular fa-print"></i> Print',
                    className: 'btn btn-sm'
                }
            ],
            responsive: true,
            pageLength: 10,
            language: {
                search: "Filter:",
                lengthMenu: "Show _MENU_ entries",
                info: "Showing _START_ to _END_ of _TOTAL_ entries",
                paginate: {
                    first: "First",
                    last: "Last",
                    next: "Next",
                    previous: "Previous"
                }
            }
        };


        // Initialize recent products table if it exists
        if ($('#productsTable').length) {
            $('#productsTable').DataTable({
                ...commonConfig,
                order: [[0, 'asc']],
                pageLength: 5,
                info: false,
                buttons: [], // Remove buttons for recent tables
            });
        }

        // Initialize recent customers table if it exists
        if ($('#customersTable').length) {
            $('#customersTable').DataTable({
                ...commonConfig,
                order: [[0, 'asc']],
                pageLength: 5,
                info: false,
                buttons: [], // Remove buttons for recent tables
            });
        }
    }

    /**
     * Initialize Bootstrap tooltips
     */
    function initializeTooltips() {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    /**
     * Handle responsive tables
     */
    function handleResponsiveTables() {
        // Add responsive wrapper to tables that don't have it
        $('.table-pink:not(.dataTable)').each(function() {
            if (!$(this).parent().hasClass('table-responsive')) {
                $(this).wrap('<div class="table-responsive"></div>');
            }
        });

        // Fix DataTables responsive on window resize
        $(window).on('resize', function() {
            if ($.fn.DataTable.isDataTable('#productsTable')) {
                $('#productsTable').DataTable().columns.adjust().responsive.recalc();
            }
            if ($.fn.DataTable.isDataTable('#customersTable')) {
                $('#customersTable').DataTable().columns.adjust().responsive.recalc();
            }
        });
    }

    /**
     * Initialize form validation (basic example)
     */
    function initializeFormValidation() {
        $('form').on('submit', function(e) {
            let isValid = true;
            
            // Check required fields
            $(this).find('[required]').each(function() {
                if (!$(this).val()) {
                    isValid = false;
                    $(this).addClass('is-invalid');
                    
                    // Add error message if not exists
                    if (!$(this).next('.invalid-feedback').length) {
                        $(this).after('<div class="invalid-feedback">This field is required</div>');
                    }
                } else {
                    $(this).removeClass('is-invalid');
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                showNotification('Please fill in all required fields', 'error');
            }
        });
    }

    /**
     * Show notification message
     * @param {string} message - Message to display
     * @param {string} type - Type of notification (success, error, warning, info)
     */
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = $(`
            <div class="notification notification-${type}" style="
                position: fixed;
                top: 100px;
                right: 20px;
                background: white;
                border-left: 4px solid ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
                z-index: 9999;
                min-width: 300px;
                animation: slideIn 0.3s ease;
            ">
                <div class="d-flex align-items-center">
                    <i class="fa-regular ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : type === 'warning' ? 'fa-triangle-exclamation' : 'fa-circle-info'}" 
                       style="color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'}; margin-right: 10px;"></i>
                    <span>${message}</span>
                    <button class="btn-close ms-3" style="font-size: 0.8rem;" onclick="this.parentElement.parentElement.remove()"></button>
                </div>
            </div>
        `);
        
        // Add to body
        $('body').append(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.fadeOut(300, function() {
                $(this).remove();
            });
        }, 5000);
    }

    /**
     * Format currency
     * @param {number} amount - Amount to format
     * @returns {string} Formatted currency
     */
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    }

    /**
     * Format date
     * @param {string} dateString - Date string to format
     * @returns {string} Formatted date
     */
    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Export functions for use in other scripts
    window.OsscentAdmin = {
        showNotification: showNotification,
        formatCurrency: formatCurrency,
        formatDate: formatDate
    };

})(jQuery);