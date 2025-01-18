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

    // Parse swimmer data from text
    parseSwimmerData(line) {
        // Clean up the line
        line = line.trim();
        if (!line) return null;

        console.log('Parsing line:', line); // Debug output

        // Format: "Order Time Name School"
        // Example: "1 1:50.65 Fox, Taylor Crimson Cliffs"
        const regex = /^\s*(\d+)\s+(\d+:\d+\.\d+)\s+([^,]+,\s*[^\s]+)\s+(.+?)\s*$/;
        const match = line.match(regex);
        
        if (match) {
            const result = {
                place: parseInt(match[1]),
                time: match[2],
                name: match[3].trim(),
                team: match[4].trim(),
                event: this.currentEventFromHeader
            };
            console.log('Successfully parsed:', result); // Debug output
            return result;
        }
        
        console.log('Failed to parse line with regex'); // Debug output
        return null;
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
                    
                    // Convert text items to lines while preserving structure
                    let currentY = null;
                    let currentLine = [];
                    const lines = [];
                    
                    textContent.items.forEach(item => {
                        if (currentY === null) {
                            currentY = item.transform[5];
                        }
                        
                        // If Y position changes significantly, it's a new line
                        if (Math.abs(currentY - item.transform[5]) > 5) {
                            if (currentLine.length > 0) {
                                lines.push(currentLine.join(' '));
                                currentLine = [];
                            }
                            currentY = item.transform[5];
                        }
                        
                        currentLine.push(item.str);
                    });
                    
                    // Add the last line if exists
                    if (currentLine.length > 0) {
                        lines.push(currentLine.join(' '));
                    }

                    console.log('Extracted lines:', lines); // Debug output
                    
                    // Process lines
                    let currentEvent = null;
                    for (const line of lines) {
                        console.log('Processing line:', line); // Debug output
                        
                        // Check for event header (e.g., "Region 9 Men 200 Free")
                        const eventHeaderMatch = line.match(/Region \d+ (?:Men|Women) (.+)/);
                        if (eventHeaderMatch) {
                            currentEvent = this.determineEventFromHeader(eventHeaderMatch[1]);
                            this.currentEventFromHeader = currentEvent;
                            console.log('Found event header:', eventHeaderMatch[1], 'mapped to:', currentEvent); // Debug output
                            continue;
                        }

                        // Skip header row
                        if (line.includes('Order') && line.includes('Time') && line.includes('Name') && line.includes('School')) {
                            console.log('Skipping header row:', line); // Debug output
                            continue;
                        }

                        const swimmerMatch = this.parseSwimmerData(line);
                        if (swimmerMatch && currentEvent) {
                            swimmerMatch.eventId = currentEvent;
                            swimmerData.push(swimmerMatch);
                            console.log('Found swimmer:', swimmerMatch); // Debug output
                        } else if (line.trim()) {
                            console.log('Failed to parse line:', line); // Debug output
                        }
                    }
                }

                if (swimmerData.length === 0) {
                    console.log('No swimmer data found. Check the parsing logic.'); // Debug output
                    this.showError('No valid swimmer data found in PDF. Please check the format.');
                    return;
                }

                // Add swimmers to events
                this.processSwimmerData(swimmerData);
                console.log('Successfully processed swimmer data:', swimmerData);
                
            } catch (error) {
                console.error('Error processing PDF:', error);
                this.showError('Failed to process PDF file. Please check the format.');
            }
        }
    }

    // Determine event from header text
    determineEventFromHeader(headerText) {
        // Map common event names to our event IDs
        const eventMap = {
            '50 Free': 'free50',
            '100 Free': 'free100',
            '200 Free': 'free200',
            '500 Free': 'free500',
            '100 Back': 'back100',
            '100 Breast': 'breast100',
            '100 Fly': 'fly100',
            '200 I.M.': 'im200',
            '200 Freestyle Relay': 'freeRelay200',
            '400 Freestyle Relay': 'freeRelay400',
            '200 Medley Relay': 'medleyRelay200'
        };

        // Clean up the header text
        const cleanHeader = headerText.trim()
            .replace('Freestyle', 'Free')
            .replace('Backstroke', 'Back')
            .replace('Breaststroke', 'Breast')
            .replace('Butterfly', 'Fly');

        // Find matching event
        for (const [key, value] of Object.entries(eventMap)) {
            if (cleanHeader.includes(key)) {
                return value;
            }
        }

        return null;
    }

    // Process parsed swimmer data
    processSwimmerData(swimmerData) {
        let addedCount = 0;
        
        for (const data of swimmerData) {
            if (data.eventId) {
                app.swimmerManager.addSwimmer(data.eventId, {
                    name: data.name,
                    team: data.team,
                    time: data.time
                });
                
                // Update placement
                app.scoringSystem.updatePlacement(data.eventId, data.name, data.place);
                addedCount++;
            }
        }
        
        // Update the UI
        this.renderEvents();
        if (addedCount > 0) {
            alert(`Successfully added ${addedCount} swimmers from PDF.`);
        } else {
            this.showError('No swimmers were added. Please check the PDF format.');
        }
    }
}

// Note: We no longer create a global UI instance here
// It will be created by SwimMeetApp