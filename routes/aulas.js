var express = require("express");
var router = express.Router();
var models = require("../models");

router.get("/", (req, res) => {
  console.log("Esto es un mensaje para ver en consola");
  models.Aula
    .findAll()
    .then(Aulas => res.send(Aulas))
    .catch(() => res.sendStatus(500));
});

router.post("/", (req, res) => {
  models.Aula
    .create({ 
              nombre: req.body.nombre,
              apellido: req.body.apellido,
              fecInscripcion: req.body.fecInscripcion,
              fecNacimiento: req.body.fecNacimiento,
              carrera_id: req.body.carrera_id
             })
    .then(Aula => res.status(201).send({ id: Aula.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otra Aula con el mismo nombre')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findAula = (id, { onSuccess, onNotFound, onError }) => {
  models.Aula
    .findOne({
      attributes: ["id"],
      where: { id }
    })
    .then(Aula => (Aula ? onSuccess(Aula) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
  findAula(req.params.id, {
    onSuccess: Aula => res.send(Aula),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id", (req, res) => {
  const onSuccess = Aula =>
    Aula
      .update({ nombre: req.body.nombre,apellido: req.body.apellido,fecInscripcion: req.body.fecInscripcion,fecNacimiento: req.body.fecNacimiento,carrera_id: req.body.carrera_id }
              ,{ fields: ["nombre","apellido","fecInscripcion","fecNacimiento" ,"carrera_id"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otra Aula con el mismo nombre')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
    findAula(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:id", (req, res) => {
  const onSuccess = Aula =>
    Aula
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findAula(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});



module.exports = router;
