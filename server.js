const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- CONFIGURAÇÃO DE UPLOADS (MULTER) ---
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const upload = multer({ storage: storage });

// --- BANCO DE DADOS POSTGRESQL ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Inicializar Tabela automaticamente
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contratos (
        id VARCHAR(50) PRIMARY KEY,
        provider_name VARCHAR(255) NOT NULL,
        cnpj VARCHAR(50),
        service TEXT,
        start_date VARCHAR(50),
        end_date VARCHAR(50),
        status VARCHAR(50),
        value VARCHAR(100),
        file_name TEXT,
        addendums JSONB DEFAULT '[]'::jsonb
      );
    `);
    console.log('Tabela de contratos verificada/criada com sucesso.');
  } catch (err) {
    console.error('Erro ao criar tabela:', err);
  }
};
initDB();

// --- ROTAS DA API ---

// Listar todos os contratos
app.get('/api/contratos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contratos ORDER BY start_date DESC');
    res.json(result.rows.map(row => ({
      ...row,
      providerName: row.provider_name,
      startDate: row.start_date,
      endDate: row.end_date,
      fileName: row.file_name
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar novo contrato (com arquivo)
app.post('/api/contratos', upload.single('file'), async (req, res) => {
  try {
    const { id, providerName, cnpj, service, startDate, endDate, value, status } = req.body;
    const fileName = req.file ? req.file.filename : null;

    const query = `
      INSERT INTO contratos (id, provider_name, cnpj, service, start_date, end_date, status, value, file_name, addendums)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *
    `;
    const values = [id, providerName, cnpj, service, startDate, endDate, status, value, fileName, JSON.stringify([])];
    
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar contrato (editar dados)
app.put('/api/contratos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { providerName, cnpj, service, startDate, endDate, value, status } = req.body;
    
    const query = `
      UPDATE contratos 
      SET provider_name = $1, cnpj = $2, service = $3, start_date = $4, end_date = $5, status = $6, value = $7
      WHERE id = $8 RETURNING *
    `;
    const values = [providerName, cnpj, service, startDate, endDate, status, value, id];
    
    await pool.query(query, values);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Adicionar Aditivo a um contrato existente (com arquivo)
app.post('/api/contratos/:id/aditivos', upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;
    const { addendumId, title, date, description } = req.body;
    const fileName = req.file ? req.file.filename : null;

    const newAddendum = { id: addendumId, title, date, description, fileName };

    const query = `
      UPDATE contratos 
      SET addendums = addendums || $1::jsonb 
      WHERE id = $2 RETURNING *
    `;
    const values = [JSON.stringify([newAddendum]), id];
    
    await pool.query(query, values);
    res.json(newAddendum);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Excluir contrato
app.delete('/api/contratos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM contratos WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Download de Arquivo
app.get('/api/download/:fileName', (req, res) => {
  const file = path.join(uploadsDir, req.params.fileName);
  if (fs.existsSync(file)) {
    res.download(file);
  } else {
    res.status(404).send('Arquivo não encontrado.');
  }
});

// --- SERVIR FRONTEND ---
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
