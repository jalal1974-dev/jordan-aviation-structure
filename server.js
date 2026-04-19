const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

const DOCS_ROOT = __dirname;

const ALLOWED_DIRS = [
  '.',
  'jav schadule and hr',
  'structure 1',
  'structure 2',
];

const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.pptx', '.png', '.jpeg', '.jfif', '.zip'];

function getDocuments() {
  const docs = [];
  for (const dir of ALLOWED_DIRS) {
    const fullDir = path.join(DOCS_ROOT, dir);
    try {
      const files = fs.readdirSync(fullDir);
      for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (ALLOWED_EXTENSIONS.includes(ext)) {
          const filePath = dir === '.' ? file : `${dir}/${file}`;
          const stat = fs.statSync(path.join(DOCS_ROOT, filePath));
          docs.push({
            name: file,
            folder: dir === '.' ? 'Root' : dir,
            path: filePath,
            ext: ext.replace('.', ''),
            size: stat.size,
          });
        }
      }
    } catch (e) {
    }
  }
  return docs;
}

app.get('/api/documents', (req, res) => {
  res.json(getDocuments());
});

app.get('/files/*', (req, res) => {
  const requestedPath = decodeURIComponent(req.params[0]);
  const fullPath = path.join(DOCS_ROOT, requestedPath);
  const normalizedRoot = path.resolve(DOCS_ROOT);
  const normalizedFull = path.resolve(fullPath);

  if (!normalizedFull.startsWith(normalizedRoot)) {
    return res.status(403).send('Forbidden');
  }

  const ext = path.extname(fullPath).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return res.status(403).send('File type not allowed');
  }

  if (!fs.existsSync(fullPath)) {
    return res.status(404).send('Not found');
  }

  res.sendFile(fullPath);
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Jordan Aviation Document Repository running on port ${PORT}`);
});
