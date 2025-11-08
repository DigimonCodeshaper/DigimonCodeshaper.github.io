import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import db from "./db_config.js";

const app = express();
app.use(express.json());
app.use(cors());

// Cria tabela se não existir
db.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId VARCHAR(255) UNIQUE,
        password VARCHAR(255)
    )
`, (err) => {
    if (err) console.error("Erro ao criar tabela:", err);
    else console.log("Tabela 'usuarios' pronta.");
});

// --- REGISTRO ---
app.post("/registrar", async (req, res) => {
    const { userId, password } = req.body;

    if (!userId || !password)
        return res.status(400).json({ success: false, error: "Preencha todos os campos." });

    // Verifica se o usuário já existe
    db.query("SELECT * FROM usuarios WHERE userId = ?", [userId], async (err, results) => {
        if (err) return res.status(500).json({ success: false, error: "Erro no servidor." });
        if (results.length > 0) return res.status(400).json({ success: false, error: "Usuário já existe." });

        // Criptografa a senha
        const hash = await bcrypt.hash(password, 10);

        // Insere novo usuário
        db.query("INSERT INTO usuarios (userId, password) VALUES (?, ?)", [userId, hash], (err) => {
            if (err) return res.status(500).json({ success: false, error: "Erro ao registrar usuário." });
            res.json({ success: true, message: "Conta criada com sucesso!" });
        });
    });
});

// --- LOGIN ---
app.post("/login", async (req, res) => {
    const { userId, password } = req.body;

    if (!userId || !password)
        return res.status(400).json({ success: false, error: "Preencha todos os campos." });

    db.query("SELECT * FROM usuarios WHERE userId = ?", [userId], async (err, results) => {
        if (err) return res.status(500).json({ success: false, error: "Erro no servidor." });
        if (results.length === 0) return res.status(400).json({ success: false, error: "Usuário não encontrado." });

        const user = results[0];
        const senhaCorreta = await bcrypt.compare(password, user.password);
        if (!senhaCorreta)
            return res.status(400).json({ success: false, error: "Senha incorreta." });

        res.json({ success: true, message: "Login bem-sucedido!" });
    });
});

// --- INICIA O SERVIDOR ---
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));
