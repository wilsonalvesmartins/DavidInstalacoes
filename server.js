const multer = require('multer');
const fs = require('fs');

// Configura o destino dos uploads
const upload = multer({ dest: 'uploads/' });

// Rota de Upload
app.post('/api/upload', upload.single('file'), (req, res) => {
  res.json({ fileName: req.file.filename, originalName: req.file.originalname });
});

// Rota de Download (Baixar o arquivo real)
app.get('/api/download/:fileName', (req, res) => {
  const file = path.join(__dirname, 'uploads', req.params.fileName);
  res.download(file);
});

**2. No Frontend (`App.jsx`):**
A função de download precisará fazer uma requisição real para essa nova rota e forçar o navegador a baixar o documento.
```javascript
const handleDownload = async (fileName) => {
  try {
    const response = await fetch(`/api/download/${fileName}`);
    const blob = await response.blob();
    
    // Cria um link temporário para forçar o download no navegador
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName; // Nome do arquivo que será salvo no PC
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (error) {
    alert("Erro ao baixar o arquivo.");
  }
};
