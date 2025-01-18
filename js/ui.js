class UI {
    constructor() {
        this.initializeElements();
        this.attachEventListeners();
        
        // Initialize PDF.js worker
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }

    // Initialize DOM element references
    initializeElements() {
        // Dropdowns
        this.regionSelect = document.getElementById('region');
        this.divisionSelect = document.getElementById('division');

        // File inputs and buttons
        this.pdfUpload = document.getElementById('pdfUpload');
        this.csvUpload = document.getElementById('csvUpload');
        this.manualEntryButton = document.getElementById('manualEntry');
        this.loadSampleButton = document.getElementById('loadSample');
        this.resetButton = document.getElementById('resetData');
        this.addEventButton = document.getElementById('addEvent');

        // Lists and containers
        this.eventsList = document.getElementById('eventsList');
        this.dragDropArea = document.querySelector('.drag-drop-area');
        this.teamScores = document.getElementById('teamScores');

        // Export buttons
        this.exportCSVButton = document.getElementById('exportCSV');
        this.exportPDFButton = document.getElementById('exportPDF');
        this.printButton = document.getElementById('printResults');
    }

    // Attach event listeners
    attachEventListeners() {
        // Region and Division selection
        this.regionSelect.addEventListener('change', () => this.handleRegionChange());
        this.divisionSelect.addEventListener('change', () => this.handleDivisionChange());

        // File uploads and data management
        this.pdfUpload.addEventListener('change', (e) => this.handlePDFUpload(e));
        this.csvUpload.addEventListener('change', (e) => this.handleCSVUpload(e));
        this.manualEntryButton.addEventListener('click', () => this.showManualEntryForm());
        this.loadSampleButton.addEventListener('click', () => this.loadSampleData());
        this.resetButton.addEventListener('click', () => app.reset());

        // Export options
        this.exportCSVButton.addEventListener('click', () => this.exportToCSV());
        this.exportPDFButton.addEventListener('click', () => this.exportToPDF());
        this.printButton.addEventListener('click', () => this.printResults());
    }

    // Render events list
    renderEvents() {
        this.eventsList.innerHTML = '';
        app.eventManager.getAllEvents().forEach(event => {
            const li = document.createElement('li');
            li.textContent = event.name;
            li.dataset.eventId = event.id;
            li.addEventListener('click', () => this.selectEvent(event.id));
            this.eventsList.appendChild(li);
        });
    }

    // Handle region change
    handleRegionChange() {
        const region = this.regionSelect.value;
        if (region) {
            // TODO: Load divisions for selected region
            console.log('Region selected:', region);
        }
    }

    // Handle division change
    handleDivisionChange() {
        const division = this.divisionSelect.value;
        if (division) {
            // TODO: Load data for selected division
            console.log('Division selected:', division);
        }
    }

    // Handle CSV upload
    handleCSVUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    // TODO: Process CSV data
                    console.log('CSV data:', e.target.result);
                } catch (error) {
                    console.error('Error processing CSV:', error);
                    this.showError('Invalid CSV format');
                }
            };
            reader.readAsText(file);
        }
    }

    // Show manual entry form
    showManualEntryForm() {
        // TODO: Implement manual entry form
        console.log('Show manual entry form');
    }

    // Load sample data
    loadSampleData() {
        // TODO: Implement sample data loading
        console.log('Loading sample data...');
    }

    // Select event
    selectEvent(eventId) {
        const event = app.eventManager.getEvent(eventId);
        if (event) {
            this.eventsList.querySelectorAll('li').forEach(li => {
                li.classList.remove('active');
                if (li.dataset.eventId === eventId) {
                    li.classList.add('active');
                }
            });
            app.eventManager.setCurrentEvent(eventId);
            // TODO: Update drag-drop area with event data
        }
    }

    // Export to CSV
    exportToCSV() {
        // TODO: Implement CSV export
        console.log('Exporting to CSV...');
    }

    // Export to PDF
    exportToPDF() {
        // TODO: Implement PDF export
        console.log('Exporting to PDF...');
    }

    // Print results
    printResults() {
        window.print();
    }

    // Show error message
    showError(message) {
        // TODO: Implement better error messaging
        alert(message);
    }

    // Handle PDF upload
    async handlePDFUpload(event) {
        const file = event.target.files[0];
        if (file) {
            try {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                
                // Process each page
                const swimmerData = [];
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map(item => item.str).join(' ');
                    
                    // Parse the text content for swimmer data
                    // This is a basic example - you'll need to adjust the parsing logic
                    // based on your PDF format
                    const lines = pageText.split('\n');
                    for (const line of lines) {
                        const swimmerMatch = this.parseSwimmerData(line);
                        if (swimmerMatch) {
                            swimmerData.push(swimmerMatch);
                        }
                    }
                }

                // Add swimmers to events
                this.processSwimmerData(swimmerData);
                
            } catch (error) {
                console.error('Error processing PDF:', error);
                this.showError('Failed to process PDF file. Please check the format.');
            }
        }
    }

    // Parse swimmer data from text
    parseSwimmerData(line) {
        // This is a placeholder implementation
        // You'll need to adjust this based on your PDF format
        const regex = /([A-Za-z\s]+)\s+(\d+:\d+\.\d+|\d+\.\d+)\s+([A-Za-z\s]+)/;
        const match = line.match(regex);
        
        if (match) {
            return {
                name: match[1].trim(),
                time: match[2],
                team: match[3].trim()
            };
        }
        return null;
    }

    // Process parsed swimmer data
    processSwimmerData(swimmerData) {
        for (const data of swimmerData) {
            const eventId = this.determineEventFromTime(data.time);
            if (eventId) {
                app.swimmerManager.addSwimmer(eventId, {
                    name: data.name,
                    team: data.team,
                    time: data.time
                });
            }
        }
        
        // Update the UI
        this.renderEvents();
        const currentEvent = app.eventManager.getCurrentEvent();
        if (currentEvent) {
            this.selectEvent(currentEvent);
        }
    }

    // Determine event based on time
    determineEventFromTime(time) {
        // This is a placeholder implementation
        // You'll need to implement logic to determine which event
        // a time corresponds to based on your requirements
        return null;
    }
}

// Note: We no longer create a global UI instance here
// It will be created by SwimMeetApp