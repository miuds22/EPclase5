var express = require("express");
var router = express.Router();
var models = require("../models");

router.get("/", (req, res) => {
  console.log("Esto es un mensaje para ver en consola");
  models.Profesor
    .findAll({
      attributes: ["id", "nombre","apellido","materia_id"],
      include:[{ model:models.materia, attributes: ["id","nombre"]}]      
    })
    .then(Profesores => res.send(Profesores))
    .catch(() => res.sendStatus(500));
});

router.post("/", (req, res) => {
  models.Profesor
    .create({ nombre: req.body.nombre, apellido:req.body.apellido, materia_id:req.body.materia_id})
    .then(Profesor => res.status(201).send({ id: Profesor.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otra Profesor con el mismo nombre')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findProfesor = (id, { onSuccess, onNotFound, onError }) => {
  models.Profesor
    .findOne({
      attributes: ["id", "nombre","apellido","materia_id"],
      where: { id }
    })
    .then(Profesor => (Profesor ? onSuccess(Profesor) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
  findProfesor(req.params.id, {
    onSuccess: Profesor => res.send(Profesor),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id", (req, res) => {
  const onSuccess = Profesor =>
    Profesor
      .update({ nombre: req.body.nombre , apellido: req.body.apellido, materia_id: req.body.materia_id  }, { fields: ["nombre","apellido",'materia_id'] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otra Profesor con el mismo nombre')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
    findProfesor(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:id", (req, res) => {
  const onSuccess = Profesor =>
    Profesor
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findProfesor(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;
