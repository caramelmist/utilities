// Enhanced Chart.js configurations for better visuals

// Modern color palette
const COLORS = {
    primary: '#4F46E5',
    primaryLight: 'rgba(79, 70, 229, 0.1)',
    secondary: '#06B6D4',
    secondaryLight: 'rgba(6, 182, 212, 0.1)',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    grid: '#E5E7EB',
    text: '#1F2937',
    textLight: '#6B7280'
};

// Chart.js default config overrides
Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.padding = 20;

// Create gradient helper
function createGradient(ctx, color1, color2) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
}

// Enhanced chart options
const ENHANCED_CHART_OPTIONS = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        mode: 'index',
        intersect: false,
    },
    plugins: {
        legend: {
            display: true,
            position: 'top',
            align: 'start',
            labels: {
                font: {
                    size: 14,
                    weight: '600'
                },
                color: COLORS.text,
                padding: 20,
                usePointStyle: true,
                pointStyle: 'circle',
                boxWidth: 8,
                boxHeight: 8
            }
        },
        tooltip: {
            enabled: true,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            padding: 16,
            cornerRadius: 10,
            titleFont: {
                size: 15,
                weight: '700'
            },
            bodyFont: {
                size: 14,
                weight: '500'
            },
            bodySpacing: 8,
            displayColors: true,
            borderColor: COLORS.primary,
            borderWidth: 2,
            usePointStyle: true,
            callbacks: {
                label: function(context) {
                    const label = context.dataset.label || '';
                    const value = context.parsed.y.toFixed(2);
                    return ' ' + label + ': ' + value + ' KW';
                },
                footer: function(tooltipItems) {
                    if (tooltipItems.length > 1) {
                        const sum = tooltipItems.reduce((acc, item) => acc + item.parsed.y, 0);
                        return 'Total: ' + sum.toFixed(2) + ' KW';
                    }
                    return '';
                }
            }
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: {
                color: COLORS.grid,
                drawBorder: false,
                lineWidth: 1
            },
            border: {
                display: false
            },
            ticks: {
                font: {
                    size: 12,
                    weight: '500'
                },
                color: COLORS.textLight,
                padding: 12,
                callback: function(value) {
                    return value.toFixed(1) + ' KW';
                }
            }
        },
        x: {
            grid: {
                display: false,
                drawBorder: false
            },
            border: {
                display: false
            },
            ticks: {
                font: {
                    size: 12,
                    weight: '500'
                },
                color: COLORS.textLight,
                padding: 10,
                maxRotation: 45,
                minRotation: 0,
                autoSkip: true,
                autoSkipPadding: 15
            }
        }
    },
    animation: {
        duration: 750,
        easing: 'easeInOutQuart'
    }
};

// Enhanced dataset configurations
function createEnhancedDataset(label, data, color, gradient, isPrimary = true) {
    return {
        label: label,
        data: data,
        borderColor: color,
        backgroundColor: gradient,
        borderWidth: 3,
        pointRadius: isPrimary ? 5 : 4,
        pointHoverRadius: isPrimary ? 8 : 6,
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: color,
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 3,
        tension: 0.4,
        fill: true,
        cubicInterpolationMode: 'monotone'
    };
}
