# Swim Meet Simulator

A web-based application for simulating and scoring swim meets. This tool helps track and calculate team scores based on swimmer placements, with support for multiple events and automatic scoring.

## Features

- Import swimmer data from PDF results
- Support for standard swim meet events
- Automatic score calculation
- Drag-and-drop interface for swimmer placement
- Real-time team score updates
- Data persistence using localStorage
- Export results to CSV or PDF

## Setup

1. Clone the repository:
```bash
git clone https://github.com/aquakid/meetsimulator.git
cd meetsimulator
```

2. Open `index.html` in your web browser or serve using a local server.

For example, using Python:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

## Usage

1. Select your region and division
2. Import swimmer data:
   - Upload a PDF file with meet results
   - Import CSV data
   - Enter data manually
3. Arrange swimmers in events using drag-and-drop
4. View real-time score calculations
5. Export results as needed

## Development

The application is built using vanilla JavaScript, HTML, and CSS, making it easy to deploy on GitHub Pages. Key files:

- `index.html`: Main application structure
- `js/`: JavaScript modules
  - `main.js`: Application initialization
  - `ui.js`: User interface handling
  - `events.js`: Event management
  - `swimmers.js`: Swimmer data handling
  - `scoring.js`: Score calculation
  - `storage.js`: Data persistence
- `css/styles.css`: Application styling

## License

MIT License - See LICENSE file for details 