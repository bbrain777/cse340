const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 5500;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.render('index', { title: 'CSE Motors | Home' }));

app.use((req, res) => res.status(404).send('Not found'));

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
