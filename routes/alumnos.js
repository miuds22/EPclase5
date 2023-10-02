var express = require("express");
var router = express.Router();
var models = require("../models");

router.get("/", (req, res) => {

  const paginaActual = parseInt(req.query.paginaActual);
  const cantidadAVer = parseInt(req.query.cantidadAVer);
  const registrosParaOmitir = (paginaActual - 1) * cantidadAVer;

  models.Alumno
    .findAll({ offset: registrosParaOmitir, limit: cantidadAVer ,
      attributes: [ "id","nombre","apellido","fecInscripcion","fecNacimiento" ,"carrera_id"]
      ,include:[{ model:models.carrera, attributes: ["id","nombre"]}]

    })
    .then(Alumnos => res.send(Alumnos))
    .catch(() => res.sendStatus(500));
});

router.post("/", (req, res) => {
  models.Alumno
    .create({ 
              nombre: req.body.nombre,
              apellido: req.body.apellido,
              fecInscripcion: req.body.fecInscripcion,
              fecNacimiento: req.body.fecNacimiento,
              carrera_id: req.body.carrera_id
             })
    .then(Alumno => res.status(201).send({ id: Alumno.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otra Alumno con el mismo nombre')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findAlumno = (id, { onSuccess, onNotFound, onError }) => {
  models.Alumno
    .findOne({
      attributes: ["id"],
      where: { id }
    })
    .then(Alumno => (Alumno ? onSuccess(Alumno) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
  findAlumno(req.params.id, {
    onSuccess: Alumno => res.send(Alumno),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id", (req, res) => {
  const onSuccess = Alumno =>
    Alumno
      .update({ nombre: req.body.nombre,apellido: req.body.apellido,fecInscripcion: req.body.fecInscripcion,fecNacimiento: req.body.fecNacimiento,carrera_id: req.body.carrera_id }
              ,{ fields: ["nombre","apellido","fecInscripcion","fecNacimiento" ,"carrera_id"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otra Alumno con el mismo nombre')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
    findAlumno(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:id", (req, res) => {
  const onSuccess = Alumno =>
    Alumno
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findAlumno(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});




module.exports = router;
