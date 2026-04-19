const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');
// Remove the lines we just added at the bottom
content = content.replace(`\n// Serve React app from dist folder\napp.use(express.static(path.join(__dirname, 'dist')));\napp.get('*', (req, res) => {\n  res.sendFile(path.join(__dirname, 'dist', 'index.html'));\n});`, '');
// Add before app.listen
content = content.replace("app.listen(PORT, 'localhost'", `// Serve React app from dist folder\napp.use(express.static(path.join(__dirname, 'dist')));\napp.get('*', (req, res) => {\n  res.sendFile(path.join(__dirname, 'dist', 'index.html'));\n});\n\napp.listen(PORT, '0.0.0.0'`);
fs.writeFileSync('server.js', content);
console.log('Done!');
