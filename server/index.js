const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

mongoose.connect('mongodb+srv://juankmilohb:juanhidalgo1006@cluster0.5lrp3ac.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a la base de datos:'));
db.once('open', () => {
  console.log('Conexión exitosa a la base de datos');
});

const idSchema = new mongoose.Schema({
  id: Number,
});
const IdModel = mongoose.model('Id', idSchema);


const app = express();
app.use(cors());
app.use(express.json());

const server = app.listen(3001, () => {
  console.log('Servidor API escuchando en http://localhost:3001');
});

const io = new Server(server,{
    cors:{
        origin: '*'
    }
});

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  IdModel.find({})
  .then(ids => {
    socket.emit('initialIds', ids);
  })
  .catch(err => {
    console.error(err);
  });


  socket.on('addId', (id) => {
    const newId = new IdModel({ id });

    newId.save()
  .then(savedId => {
    io.emit('newId', savedId);
  })
  .catch(err => {
    console.error(err);
  });

  });

  // Manejar desconexiones de clientes
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});