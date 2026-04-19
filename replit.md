# Jordan Aviation Document Repository

A web-based document viewer for Jordan Aviation organizational, operational, and compliance documents.

## Architecture

- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Port**: 5000 (0.0.0.0)
- **Frontend**: Vanilla HTML/CSS/JS served as static files from `public/`

## Project Structure

```
server.js          - Express server (serves files + API)
public/index.html  - Single-page document browser UI
package.json       - Node.js dependencies
```

### Document Folders

| Folder | Contents |
|---|---|
| Root | General org charts and SOPs |
| `jav schadule and hr/` | HR, schedule, and digital transformation plans |
| `structure 1/` | Airline & MRO SOPs (Arabic & English) |
| `structure 2/` | Ops manuals, certificates, compliance docs |

## Features

- Browse all documents by folder
- Search by name
- Filter by file type (PDF, DOCX, PPTX, ZIP)
- In-browser PDF and image preview
- Download any document

## API

- `GET /api/documents` — Returns list of all documents (name, folder, path, ext, size)
- `GET /files/<path>` — Serve a document file (security-checked)

## Running

```bash
node server.js
```

Server starts on port 5000.
