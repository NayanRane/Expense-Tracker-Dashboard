let transactions = [];
let originalParent = null;
let placeholder = null;
let lastTargetSelector = null;
const incomeCategories = [
    "Salary",
    "Freelance",
    "Business",
    "Investments",
    "Interest",
    "Gifts",
    "Rental Income",
    "Dividends",
    "Refunds",
    "Other Income"
];

const expenseCategories = [
    "Food & Dining",
    "Transportation",
    "Rent",
    "Utilities",
    "Entertainment",
    "Healthcare",
    "Education",
    "Travel",
    "Shopping",
    "Insurance",
    "Loan Payments",
    "Subscriptions",
    "Groceries",
    "Taxes",
    "Miscellaneous"
];

let incomeExpenseChartInstance = null;
let totalBalanceChartInstance = null;
let categorySpendingRoot = null;
let dateInput = document.getElementById("date");
const monthPicker = document.getElementById('monthPicker');

const form = document.getElementById('addData');

document.addEventListener('DOMContentLoaded', function () {
    funcDateFormat();
    funcMonthFormat();
    funcMonthFormat2();

    $("#kt_datatable_dom_positioning").DataTable({
        "language": {
            "lengthMenu": "Show _MENU_",
        },
        "dom":
            "<'row mb-2 justify-content-between m-3'" +
            // "<'col-sm-6 d-flex align-items-center justify-conten-start dt-toolbar'l>" +
            "<'col-sm-6 d-flex align-items-center justify-content-end dt-toolbar'f>" +
            "<'col-sm-4 d-flex align-items-center justify-content-center dt-toolbar'B>" +
            ">" +


            "<'table-responsive'tr>" +

            "<'row'" +
            "<'col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start'i>" +
            "<'col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end'p>" +
            ">",
        buttons: [
            {
                extend: 'excelHtml5',
                text: 'Export to Excel',
                // title: 'Transactions',
                className: 'btn kt-btn',
                exportOptions: {
                    columns: ':visible' // export only visible columns
                },
                title: function () {
                    // get the selected month-year from your input (assuming its id is 'month-picker' or similar)
                    // Update this selector to match your actual date picker input
                    var selectedMonthYear = $('#monthPicker2').val();
                    if (selectedMonthYear) {
                        return 'Transactions - ' + `[${selectedMonthYear}]`;
                    } else {
                        return 'Transactions'; // agar kuch select nahi hai toh sirf ye show hoga
                    }
                }
            }
        ],
    });
    IncomeExpenseChart(transactions);
    TotalBalanceChart(transactions);
    RecentTransactions(transactions);
    const getCurrentMonthYear = () => {
        const now = new Date();
        // Format as MM-YYYY (e.g., "09-2025")
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        return `${month}-${year}`;
    };

    let initialDate = getCurrentMonthYear();

    CategorySpendingChart(transactions, initialDate);

    const themeToggle = document.querySelector('input[data-kt-theme-switch-toggle="true"]');

    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            setTimeout(() => {
                IncomeExpenseChart();
                TotalBalanceChart();
                CategorySpendingChart();
            }, 100);
        });
    }

    document.querySelectorAll('.kt-menu-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Get the target section ID
            const targetId = this.getAttribute('href').substring(1);

            // Hide all content sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });

            // Show the selected section
            document.getElementById(targetId).classList.add('active');

            // Update active menu item
            document.querySelectorAll('.kt-menu-item').forEach(item => {
                item.classList.remove('active');
            });
            this.closest('.kt-menu-item').classList.add('active');
        });
    });

    document.getElementById('overview').classList.add('active');

    document.getElementById("source").addEventListener("change", function (event) {
        const selectedSource = event.target.value;
        const categorySelect = document.getElementById("category");

        categorySelect.innerHTML = '<option value="">Select Category</option>';
        let categoriesToBind = [];

        if (selectedSource === "Income") {
            categoriesToBind = incomeCategories;
        } else if (selectedSource === "Expense") {
            categoriesToBind = expenseCategories;
        }

        categoriesToBind.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });


    });

    // document.getElementById('startBtn').addEventListener('click', () => {
    //     introJs().start();
    // });
    const tour = new Shepherd.Tour({
        useModalOverlay: false,
        defaultStepOptions: {
            cancelIcon: {
                enabled: true
            },
            classes: 'shepherd-theme-arrows',
            scrollTo: { behavior: 'smooth', block: 'center' }
        }
    });

    function unblurElement(selector) {
        const el = document.querySelector(selector);
        if (!el) return;

        // Save parent and placeholder
        originalParent = el.parentElement;
        placeholder = document.createElement('div');
        placeholder.style.display = 'none';
        originalParent.insertBefore(placeholder, el);

        // Get current position and size
        const rect = el.getBoundingClientRect();

        // Move to body
        document.body.appendChild(el);

        // Style it to stay in same position
        Object.assign(el.style, {
            position: 'fixed',
            top: `${rect.top}px`,
            left: `${rect.left}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            zIndex: '100000',
            pointerEvents: 'auto',
            filter: 'none',
            opacity: '1',
        });

        el.classList.add('unblurred');
    }

    function restoreElement(selector) {
        const el = document.querySelector(selector);
        if (el && originalParent && placeholder) {
            originalParent.insertBefore(el, placeholder);
            placeholder.remove();

            // Clean styles
            el.removeAttribute('style');
            el.classList.remove('unblurred');
        }
    }

    // Add steps to the tour
    tour.addStep({
        id: 'step-1',
        text: 'Welcome to your expense dashboard!',
        attachTo: {
            // element: '#startBtn', // Element to highlight
            on: 'center'
        },
        buttons: [
            {
                text: 'Next',
                action: tour.next
            }
        ]
    });

    tour.addStep({
        id: 'step-2',
        text: 'Here you can track your expenses and manage budgets.',
        attachTo: {
            element: '#transaction-modal', // Replace with actual element selector
            on: 'right'
        },
        buttons: [
            {
                text: 'Back',
                action: tour.back
            },
            {
                text: 'Done',
                action: tour.complete
            }
        ]
    });

    tour.on('show', (e) => {

        const target = e.step.options.attachTo?.element;
        if (target) {
            unblurElement(target);
        }
    });

    // Start tour when button clicked
    document.getElementById('startBtn').addEventListener('click', () => {
        tour.start();
        document.body.classList.add('modal-open');
        document.getElementById('mainContent').classList.add('blurred');
    });

    tour.on('complete', () => {
        document.body.classList.remove('modal-open');
        document.getElementById('mainContent').classList.remove('blurred');
        restoreElement('#transaction-modal');
    });

    tour.on('cancel', () => {
        document.body.classList.remove('modal-open');
        document.getElementById('mainContent').classList.remove('blurred');
        restoreElement('#transaction-modal');
    });

});

monthPicker.addEventListener('change', (e) => {
    // Convert YYYY-MM to MM-YYYY for your chart function
    const [month, year] = e.target.value.split('-');
    const formatted = `${month}-${year}`;
    CategorySpendingChart(transactions, formatted);
});


const IncomeExpenseChart = (transactions) => {
    const element = document.getElementById('kt_apexcharts_2');
    const messageElement = document.getElementById('chartMessage');
    if (!element) return;

    const height = 300;

    // Detect theme from <html> class or data-kt-theme-mode
    let themeMode = document.documentElement.classList.contains('dark')
        || document.documentElement.getAttribute('data-kt-theme-mode') === 'dark'
        ? 'dark'
        : 'light';

    const labelColor = themeMode === 'dark' ? '#CBD5E0' : KTUtil.getCssVariableValue('--kt-gray-500');
    const borderColor = themeMode === 'dark' ? '#2D3748' : KTUtil.getCssVariableValue('--kt-gray-200');
    const baseColor = KTUtil.getCssVariableValue('--kt-primary') || '#2F80ED';
    const secondaryColor = KTUtil.getCssVariableValue('--kt-gray-300') || '#56CCF2';

    const monthlyData = {};

    transactions.forEach(({ amount, source, date }) => {
        const [day, month, year] = date.split('-');
        const key = `${month}-${year}`; // e.g., "09-2025"

        if (!monthlyData[key]) {
            monthlyData[key] = { income: 0, expense: 0 };
        }

        if (source === 'Income') {
            monthlyData[key].income += amount;
        } else if (source === 'Expense') {
            monthlyData[key].expense += amount;
        }
    });

    // ✅ Step 2: Sort months
    const sortedKeys = Object.keys(monthlyData).sort((a, b) => {
        const [ma, ya] = a.split('-').map(Number);
        const [mb, yb] = b.split('-').map(Number);
        return new Date(ya, ma - 1) - new Date(yb, mb - 1);
    });
    const hasData = transactions && transactions.length > 0;


    const categories = hasData
        ? sortedKeys.map(key => {
            const [month, year] = key.split('-');
            const date = new Date(`${year}-${month}-01`);
            return date.toLocaleString('default', { month: 'short', year: 'numeric' }); // e.g., "Sep 2025"
        }) : ['Apr', 'May', 'Jun', 'Jul', 'Aug'];

    const incomeData = hasData ? sortedKeys.map(key => monthlyData[key].income) : [2000, 3000, 2500, 2200, 2700];
    const expenseData = hasData ? sortedKeys.map(key => monthlyData[key].expense) : [1200, 1600, 1400, 1000, 1800];

    // Destroy old chart if it exists
    if (incomeExpenseChartInstance) {
        incomeExpenseChartInstance.destroy();
    }

    element.innerHTML = '';
    element.style.height = height + 'px';

    const options = {
        series: [{
            name: 'Income',
            data: incomeData
        }, {
            name: 'Expense',
            data: expenseData
        }],
        chart: {
            fontFamily: 'inherit',
            type: 'bar',
            height: height,
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: ['50%'],
                endingShape: 'rounded'
            },
        },
        legend: {
            show: false
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: categories,
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false
            },
            labels: {
                style: {
                    colors: labelColor,
                    fontSize: '12px'
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: labelColor,
                    fontSize: '12px'
                }
            }
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            style: {
                fontSize: '12px'
            },
            y: {
                formatter: function (val) {
                    return '$' + val + ' thousands';
                }
            }
        },
        colors: [baseColor, secondaryColor],
        grid: {
            borderColor: borderColor,
            strokeDashArray: 4,
            yaxis: {
                lines: {
                    show: true
                }
            }
        }
    };

    // Create and render the chart
    chartInstance = new ApexCharts(element, options);
    // element.classList.toggle('blurred-chart', !hasData);
    if (!hasData) {
        element.classList.add('blurred');
        messageElement.style.display = 'block';
        // Show dummy chart...
    } else {
        element.classList.remove('blurred');
        messageElement.style.display = 'none';
        // Show real chart...
    }
    chartInstance.render();
};

const TotalBalanceChart = (transactions) => {
    const element = document.getElementById('kt_apexcharts_3');
    const messageElement = document.getElementById('balanceChartMessage');
    if (!element) return;

    const height = 300;
    let themeMode = document.documentElement.classList.contains('dark')
        || document.documentElement.getAttribute('data-kt-theme-mode') === 'dark'
        ? 'dark'
        : 'light';

    const labelColor = themeMode === 'dark' ? '#CBD5E0' : KTUtil.getCssVariableValue('--kt-gray-500');
    const borderColor = themeMode === 'dark' ? '#2D3748' : KTUtil.getCssVariableValue('--kt-gray-200');
    var baseColor = KTUtil.getCssVariableValue('--kt-info') || '#FFA500';
    var lightColor = KTUtil.getCssVariableValue('--kt-info-light') || '#FFB84D';

    const monthlyBalance = {};
    const hasData = transactions && transactions.length > 0;

    if (hasData) {
        transactions.forEach(({ amount, source, date }) => {
            const [day, month, year] = date.split('-');
            const key = `${month}-${year}`; // e.g., "09-2025"
            if (!monthlyBalance[key]) {
                monthlyBalance[key] = 0;
            }

            if (source === 'Income') {
                monthlyBalance[key] += amount;
            } else if (source === 'Expense') {
                monthlyBalance[key] -= amount;
            }
        });

    }


    // ✅ Step 2: Sort and prepare data
    const sortedKeys = Object.keys(monthlyBalance).sort((a, b) => {
        const [ma, ya] = a.split('-').map(Number);
        const [mb, yb] = b.split('-').map(Number);
        return new Date(ya, ma - 1) - new Date(yb, mb - 1);
    });

    const categories = hasData
        ? sortedKeys.map(key => {
            const [month, year] = key.split('-');
            const date = new Date(`${year}-${month}-01`);
            return date.toLocaleString('default', { month: 'short', year: 'numeric' });
        }) : ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

    const balanceData = hasData ? sortedKeys.map(key => monthlyBalance[key]) : [3000, 2800, 3500, 3700, 3600, 4000];

    if (totalBalanceChartInstance) {
        totalBalanceChartInstance.destroy();
    }

    element.innerHTML = '';
    element.style.height = height + 'px';

    var options = {
        series: [{
            name: 'Net Profit',
            data: balanceData
        }],
        chart: {
            fontFamily: 'inherit',
            type: 'area',
            height: height,
            toolbar: {
                show: false
            }
        },
        plotOptions: {

        },
        legend: {
            show: false
        },
        dataLabels: {
            enabled: false
        },
        fill: {
            type: 'solid',
            gradient: {
                shade: 'dark',
                type: 'vertical',
                shadeIntensity: 0.7,
                gradientToColors: ['#FFB84D'], // light purple at bottom
                inverseColors: false,
                opacityFrom: 0.9,
                opacityTo: 0.3,
                stops: [0, 90, 100]
            }
        },
        stroke: {
            curve: 'smooth',
            show: true,
            width: 3,
            colors: [baseColor]
        },
        xaxis: {
            categories: categories,
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false
            },
            labels: {
                style: {
                    colors: labelColor,
                    fontSize: '12px'
                }
            },
            crosshairs: {
                position: 'front',
                stroke: {
                    color: baseColor,
                    width: 1,
                    dashArray: 3
                }
            },
            tooltip: {
                enabled: true,
                formatter: undefined,
                offsetY: 0,
                style: {
                    fontSize: '12px'
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: labelColor,
                    fontSize: '12px'
                }
            }
        },
        states: {
            normal: {
                filter: {
                    type: 'none',
                    value: 0
                }
            },
            hover: {
                filter: {
                    type: 'none',
                    value: 0
                }
            },
            active: {
                allowMultipleDataPointsSelection: false,
                filter: {
                    type: 'none',
                    value: 0
                }
            }
        },
        tooltip: {
            style: {
                fontSize: '12px'
            },
            y: {
                formatter: function (val) {
                    return '$' + val + ' thousands'
                }
            }
        },
        colors: [lightColor],
        grid: {
            borderColor: borderColor,
            strokeDashArray: 4,
            yaxis: {
                lines: {
                    show: true
                }
            }
        },
        markers: {
            strokeColor: baseColor,
            strokeWidth: 3
        }
    };

    var chart = new ApexCharts(element, options);
    if (!hasData) {
        element.classList.add('blurred');
        messageElement.style.display = 'block';
        // Show dummy chart...
    } else {
        element.classList.remove('blurred');
        messageElement.style.display = 'none';
        // Show real chart...
    }

    chart.render();
}

const CategorySpendingChart = (transactions, selectedMonthYear) => {
    am5.ready(function () {
        // Destroy previous chart if exists
        if (categorySpendingRoot) {
            categorySpendingRoot.dispose();
        }

        // Detect theme
        let themeMode = document.documentElement.classList.contains('dark')
            || document.documentElement.getAttribute('data-kt-theme-mode') === 'dark'
            ? 'dark'
            : 'light';

        // Create root
        categorySpendingRoot = am5.Root.new("chartdiv");
        const root = categorySpendingRoot;

        // Set theme based on current mode
        const themes = [am5themes_Animated.new(root)];
        if (themeMode === 'dark') {
            themes.push(am5themes_Dark.new(root));
        }

        root.setThemes(themes);

        // Create chart
        var chart = root.container.children.push(
            am5percent.PieChart.new(root, {
                layout: root.verticalLayout
            })
        );

        // Create series
        var series = chart.series.push(
            am5percent.PieSeries.new(root, {
                name: "Spending",
                valueField: "value",
                categoryField: "category"
            })
        );

        series.labels.template.set("visible", false);
        series.ticks.template.set("visible", false);

        const [selectedMonth, selectedYear] = selectedMonthYear.split('-');
        const categoryTotals = {};


        transactions.forEach(({ amount, source, category, date }) => {
            if (source !== 'Expense') return;

            const [day, month, year] = date.split('-');

            if (month === selectedMonth && year === selectedYear) {
                if (!categoryTotals[category]) {
                    categoryTotals[category] = 0;
                }
                categoryTotals[category] += amount;
            }
        });

        // ✅ Convert to array for chart data
        let data = Object.entries(categoryTotals).map(([category, value]) => ({
            category,
            value
        }));

        const usingDummyData = data.length === 0;

        if (usingDummyData) {
            data = [
                { category: "Groceries", value: 500 },
                { category: "Utilities", value: 300 },
                { category: "Car", value: 200 },
                { category: "Education", value: 250 },
                { category: "Withdraw", value: 100 }
            ];

            document.getElementById("monthPicker").disabled = true;

            const chartDiv = document.getElementById("chartdiv");
            if (chartDiv) chartDiv.classList.add("blurred"); // You can style .blurred in CSS

            // Optional: Show a message overlay
            const chartMessage = document.getElementById("categoryChartMessage");
            if (chartMessage) chartMessage.style.display = "block";
        } else {
            // Remove blur and message if real data is present
            document.getElementById("monthPicker").disabled = false;
            const chartDiv = document.getElementById("chartdiv");
            if (chartDiv) chartDiv.classList.remove("blurred");

            const chartMessage = document.getElementById("categoryChartMessage");
            if (chartMessage) chartMessage.style.display = "none";
        }

        // Set data
        series.data.setAll(data);

        // Custom slice styling
        series.slices.template.setAll({
            stroke: am5.color(0xffffff),
            strokeWidth: 0.5
        });

        series.get("colors").setAll([
            am5.color(0x4F46E5), // Groceries
            am5.color(0x22C55E), // Utilities
            am5.color(0xF59E0B), // Car
            am5.color(0x38BDF8), // Education
            am5.color(0xEF4444)  // Withdraw
        ]);

        // Add legend
        chart.children.push(
            am5.Legend.new(root, {
                centerX: am5.p50,
                x: am5.p50
            })
        );

        // Animate
        series.appear(1000, 100);
        chart.appear(1000, 100);
    });
};

const RecentTransactions = (transactions) => {

    const element = document.getElementById('table');
    const messageElement = document.getElementById('tableMessage');
    let dummytransactions = [{ amount: 20000, source: "Income", category: "Salary", date: "01-03-2025", mode: "Cash" }, { amount: 1000, source: "Expense", category: "Food", date: "02-03-2025", mode: "Cash" }]

    const hasData = transactions && transactions.length > 0;

    if (!hasData) {
        element.classList.add('blurred');
        messageElement.style.display = 'block';
        document.getElementById("monthPicker2").disabled = true;
        BindTable(dummytransactions)
    } else {
        element.classList.remove('blurred');
        messageElement.style.display = 'none';
        document.getElementById("monthPicker2").disabled = false;
        BindTable(transactions);        // Show real chart...
    }


}

const BindTable = (transactions, filterMonthYear = "") => {
    const table = $('#kt_datatable_dom_positioning').DataTable(); // Get DataTable instance

    // Clear existing rows
    table.clear();

    // Convert each transaction into an array matching the column order
    const rows = transactions.map(transaction => [
        transaction.mode || '',
        transaction.source || '',
        transaction.category || '',
        transaction.date || '',
        transaction.amount != null ? transaction.amount : ''
    ]);

    // Add rows and redraw
    table.rows.add(rows).draw();

    // Toggle "waiting for first transaction..." message
    // if (transactions.length === 0) {
    //     $('#tableMessage').show();
    // } else {
    //     $('#tableMessage').hide();
    // }
};


const funcDateFormat = () => {

    flatpickr("#date", {
        disableMobile: true,
        enableTime: false,
        dateFormat: "d-m-Y",
        maxDate: "today",
        allowInput: true,

        onOpen: function () {
            updateFlatpickrTheme();  // dynamically switch styles
        }
    });
}

const funcMonthFormat = () => {
    flatpickr("#monthPicker", {
        disableMobile: true,
        enableTime: false,
        dateFormat: "m-Y",  // month and year
        maxDate: "today",
        allowInput: true,
        plugins: [
            new monthSelectPlugin({
                shorthand: true, // display short month names
                dateFormat: "m-Y", // format displayed in input
                altFormat: "F Y", // human readable format
            })
        ],

        onOpen: function (selectedDates, dateStr, instance) {
            updateFlatpickrTheme();  // dynamically switch styles

            setTimeout(() => {
                instance._positionCalendar(); // this is a Flatpickr internal method
            }, 50); // Delay gives time for theme CSS to apply
        },
    });
}


function updateFlatpickrTheme() {
    const theme = document.documentElement.getAttribute("data-kt-theme-switch-mode");
    const lightCSS = document.getElementById("flatpickr-light-css");
    const darkCSS = document.getElementById("flatpickr-dark-css");

    if (theme === "dark") {
        darkCSS.disabled = false;
        lightCSS.disabled = true;
    } else {
        darkCSS.disabled = true;
        lightCSS.disabled = false;
    }
}

function isNumberKey(evt) {
    const charCode = evt.which ? evt.which : evt.keyCode;
    const charStr = String.fromCharCode(charCode);

    // Allow only digits (0-9) and dot (.)
    if (!charStr.match(/[0-9.]/)) {
        evt.preventDefault();
        return false;
    }

    // Prevent more than one dot
    if (charStr === '.' && evt.target.value.includes('.')) {
        evt.preventDefault();
        return false;
    }

    // Prevent space (charCode 32)
    if (charCode === 32) {
        evt.preventDefault();
        return false;
    }

    return true;
}

document.getElementById("btnSubmit").addEventListener("click", function (e) {
    e.preventDefault();

    let isValid = true;
    const modalElement = document.getElementById('modal'); // replace 'myModal' with your modal's actual id
    const ktModal = KTModal.getInstance(modalElement);

    // Clear previous errors
    document.getElementById("amountError").textContent = "";
    document.getElementById("categoryError").textContent = "";
    document.getElementById("dateError").textContent = "";
    document.getElementById("sourceError").textContent = "";
    document.getElementById("modeError").textContent = "";

    // Validate amount
    const amount = document.getElementById("amount").value.trim();
    if (amount === "" || isNaN(amount) || parseFloat(amount) <= 0) {
        document.getElementById("amountError").textContent = "Please enter a valid amount.";
        isValid = false;
    }

    const source = document.getElementById("source").value;
    if (!source) {
        document.getElementById("sourceError").textContent = "Please select a source.";
        isValid = false;
    }

    // Validate category
    const category = document.getElementById("category").value;
    if (!category) {
        document.getElementById("categoryError").textContent = "Please select a category.";
        isValid = false;
    }

    const mode = document.getElementById("mode").value;
    if (!mode) {
        document.getElementById("modeError").textContent = "Please select a mode.";
        isValid = false;
    }


    // Validate date
    const date = document.getElementById("date").value.trim();
    if (date === "") {
        document.getElementById("dateError").textContent = "Please select a date.";
        isValid = false;
    } else {
        const datePattern = /^\d{2}-\d{2}-\d{4}$/; // Optional: enforce YYYY-MM-DD format
        if (!datePattern.test(date)) {
            document.getElementById("dateError").textContent = "Invalid date format (use DD-MM-YYYY).";
            isValid = false;
        }
    }

    if (isValid) {
        // Submit the form
        let amount = document.getElementById("amount").value;
        let source = document.getElementById("source").value;
        let category = document.getElementById("category").value;
        let date = document.getElementById("date").value;
        let mode = document.getElementById("mode").value;




        let transaction = {
            amount: parseFloat(amount),
            source: source,
            category: category,
            date: date,
            mode: mode
        };

        const [day, month, year] = date.split("-");
        const formatDate = `${month}-${year}`;

        // if (source.toLowerCase() === "expense") {
        //     const hasIncomeInSameMonth = transactions.some(t => {
        //         if (t.source.toLowerCase() === "income") {
        //             const [tDay, tMonth, tYear] = t.date.split("-");
        //             const tFormatDate = `${tMonth}-${tYear}`;
        //             return tFormatDate === formatDate;
        //         }
        //         return false;
        //     });    
        //     if (!hasIncomeInSameMonth) {
        //         alert("Please add an Income for this month before adding an Expense.");
        //         return; // stop further execution
        //     } else {
        //         document.getElementById('monthPicker').value = formatDate;
        //     }
        // }

        if (source.toLowerCase() === "expense") {
            // Get total income and total expenses for the same month
            let totalIncome = 0;
            let totalExpenses = 0;

            transactions.forEach(t => {
                const [tDay, tMonth, tYear] = t.date.split("-");
                const tFormatDate = `${tMonth}-${tYear}`;

                if (tFormatDate === formatDate) {
                    if (t.source.toLowerCase() === "income") {
                        totalIncome += parseFloat(t.amount);
                    } else if (t.source.toLowerCase() === "expense") {
                        totalExpenses += parseFloat(t.amount);
                    }
                }
            });

            // Check if there's any income
            if (totalIncome === 0) {
                // alert("Please add an Income for this month before adding an Expense.");
                openCustomAlert("Please add an Income for this month before adding an Expense.")
                return;
            }

            // Check if new expense will exceed total income
            if (totalExpenses + parseFloat(amount) > totalIncome) {
                // alert("Total expenses for this month cannot exceed the total income.");
                openCustomAlert("Total expenses for this month cannot exceed the total income.")
                return;
            }

            // If valid, set the month picker
            document.getElementById('monthPicker').value = formatDate;
        }



        // Add the transaction object to the array
        transactions.push(transaction);
        IncomeExpenseChart(transactions);
        TotalBalanceChart(transactions);
        CategorySpendingChart(transactions, formatDate);
        RecentTransactions(transactions);
        ktModal.hide()
        modalElement.querySelectorAll('input, select').forEach(input => {
            if (input.type === 'checkbox' || input.type === 'radio') {
                input.checked = false;
            }
            else if (input.tagName.toLowerCase() === 'select') {
                // Reset the native <select>
                input.selectedIndex = 0;
                const newValue = input.options[0].value;

                const $input = $(`#${input.id}`);
                $input.val(newValue).trigger('change');

                if (input.dataset.ktSelect === "true") {
                    // Using .instance to get KTSelect instead of getInstance()
                    const ktInstance = input.instance;
                    if (ktInstance) {
                        // Depends on KTSelect's API — try a method that sets value or resets
                        if (ktInstance._options) {
                            //   ktInstance.setValue(newValue);
                            ktInstance._options.forEach(optionLi => {
                                optionLi.classList.remove('selected');
                            });

                            const firstOptionLi = ktInstance._options[0];
                            if (firstOptionLi) {
                                firstOptionLi.classList.add('selected');
                            }

                            ktInstance._state._selectedOptions = [newValue];
                            if (ktInstance._displayElement) {
                                const displayText = input.options[0].text || "Select an option";
                                ktInstance._displayElement.innerHTML = displayText;
                            }
                        } else if (typeof ktInstance.refresh === 'function') {
                            // maybe there is refresh or update
                            ktInstance.refresh();
                        }
                        // etc. — inspect ktInstance in console to see what methods are there
                    } else {
                        // If no instance, maybe you can reinitialize
                        try {
                            input.instance = new KTSelect(input, {});
                        } catch (e) {
                            console.warn('KTSelect init failed', e);
                        }
                    }
                }
            }
            else {
                input.value = '';
                if (input._flatpickr) {
                    input._flatpickr.clear();
                }
            }
        });
        closeModalAndClearErrors();
    }
});


const closeModalAndClearErrors = () => {
    const errorFields = ["amountError", "sourceError", "categoryError", "modeError", "dateError"];
    errorFields.forEach(function (id) {
        const el = document.getElementById(id);
        if (el) el.textContent = "";
    });
}


function openCustomAlert(msg) {
    // Set the message inside the modal
    document.getElementById('customAlertText').textContent = msg;

    // Get the modal element
    const modalElement = document.getElementById('customAlertOverlay');

    // Initialize KT modal instance if not already initialized
    let modalInstance = KTModal.getInstance(modalElement);
    if (!modalInstance) {
        modalInstance = new KTModal(modalElement);
    }

    // Show the modal
    modalInstance.show();
}

const funcMonthFormat2 = () => {
    flatpickr("#monthPicker2", {
        disableMobile: true,
        enableTime: false,
        dateFormat: "m-Y",  // month and year
        maxDate: "today",
        allowInput: true,
        plugins: [
            new monthSelectPlugin({
                shorthand: true, // display short month names
                dateFormat: "m-Y", // format displayed in input
                altFormat: "F Y", // human readable format
            })
        ],

        onOpen: function (selectedDates, dateStr, instance) {
            updateFlatpickrTheme();  // dynamically switch styles

            setTimeout(() => {
                instance._positionCalendar(); // this is a Flatpickr internal method
            }, 50); // Delay gives time for theme CSS to apply
        },
    });
}


document.getElementById("monthPicker2").addEventListener("change", function () {
    let filterMonthYear = this.value;

    if (filterMonthYear == "") {
        BindTable(transactions);
    } else {
        const filteredTransactions = filterTransactionsByMonthYear(transactions, filterMonthYear);
        BindTable(filteredTransactions);
    }

});


function filterTransactionsByMonthYear(transactions, filterMonthYear) {
    if (!filterMonthYear || filterMonthYear.trim() === "") {
        // Agar filter empty ho to pura array return karo
        return transactions;
    }

    // Filter transactions where date's MM-YYYY matches filterMonthYear
    return transactions.filter(transaction => {
        if (!transaction.date) return false;

        // date format: DD-MM-YYYY
        const parts = transaction.date.split('-');
        if (parts.length !== 3) return false;

        const monthYear = parts[1] + '-' + parts[2];  // MM-YYYY
        return monthYear === filterMonthYear;
    });
}


