// @ts-check
const fs = require('fs');
const path = require('path');
const { RendererEvent } = require('typedoc');

/**
 * A typedoc plugin that adds custom navigation links
 */
exports.load = function load(app) {
  // Only add the custom CSS and links at the end after docs are generated
  app.renderer.on(RendererEvent.END, onRendererEnd);

  function onRendererEnd(renderer) {
    console.log('Adding custom navigation links and styles to the documentation...');
    
    // Copy our custom CSS file to the assets directory
    const customCssPath = path.resolve(__dirname, 'assets', 'custom.css');
    const targetCssPath = path.resolve(renderer.outputDirectory, 'assets', 'custom.css');
    
    if (fs.existsSync(customCssPath)) {
      try {
        fs.mkdirSync(path.dirname(targetCssPath), { recursive: true });
        fs.copyFileSync(customCssPath, targetCssPath);
        
        // Inject the custom CSS link and modify the HTML content directly
        const files = findHtmlFiles(renderer.outputDirectory);
        
        for (const file of files) {
          let content = fs.readFileSync(file, 'utf8');
          
          // 1. Add the custom CSS in the head
          if (!content.includes('assets/custom.css')) {
            content = content.replace(
              '</head>',
              '  <link rel="stylesheet" href="assets/custom.css">\n</head>'
            );
          }
          
          // 2. Add the toolbar links - more robust approach by targeting a specific element
          const toolbarLinks = `<div id="tsd-toolbar-links">
            <a href="https://app.hop.exchange/" target="_blank" rel="noopener">Visit App</a>
            <a href="https://v2-playground.hop.exchange/" target="_blank" rel="noopener">V2 Playground</a>
            <a href="https://v2-explorer.hop.exchange/" target="_blank" rel="noopener">Explorer</a>
          </div>`;
          
          // Insert after the search field but before the search results
          if (content.includes('<input type="text" id="tsd-search-field"')) {
            content = content.replace(
              '<input type="text" id="tsd-search-field"',
              '<input type="text" id="tsd-search-field"'
            );
            
            content = content.replace(
              '</div>\n\n                <ul class="results">',
              `</div>\n\n                ${toolbarLinks}\n\n                <ul class="results">`
            );
          }
          
          // 3. Add the mobile menu links
          const mobileLinks = `<div class="tsd-navigation-links">
            <a href="https://app.hop.exchange/" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-6h10v2H7zm0-4h10v2H7z"></path>
              </svg>
              Visit App
            </a>
            <a href="https://v2-playground.hop.exchange/" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"></path>
              </svg>
              V2 Playground
            </a>
            <a href="https://v2-explorer.hop.exchange/" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h2v10H7V7zm4 2h2v8h-2V9zm4 1h2v7h-2v-7z"></path>
              </svg>
              Explorer
            </a>
          </div>`;
          
          // Insert at the beginning of the navigation
          if (content.includes('<nav class="tsd-navigation primary">')) {
            content = content.replace(
              '<nav class="tsd-navigation primary">',
              `${mobileLinks}\n<nav class="tsd-navigation primary">`
            );
          } else if (content.includes('<nav class="tsd-navigation">')) {
            content = content.replace(
              '<nav class="tsd-navigation">',
              `${mobileLinks}\n<nav class="tsd-navigation">`
            );
          }
          
          fs.writeFileSync(file, content);
        }
        
        console.log('Custom navigation links and styles added successfully!');
      } catch (error) {
        console.error('Error modifying documentation:', error);
      }
    } else {
      console.error('Custom CSS file not found:', customCssPath);
    }
  }

  function findHtmlFiles(directory) {
    try {
      const files = [];
      const items = fs.readdirSync(directory, { withFileTypes: true });
      
      for (const item of items) {
        const itemPath = path.join(directory, item.name);
        
        if (item.isDirectory()) {
          files.push(...findHtmlFiles(itemPath));
        } else if (item.name.endsWith('.html')) {
          files.push(itemPath);
        }
      }
      
      return files;
    } catch (error) {
      console.error('Error finding HTML files:', error);
      return [];
    }
  }
}; 