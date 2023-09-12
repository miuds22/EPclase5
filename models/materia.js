'use strict';
module.exports = (sequelize, DataTypes) => {
  const materia = sequelize.define('materia', {
    nombre: DataTypes.STRING,
    carrera_id: DataTypes.INTEGER
  }, {tableName:"materias"});
  
  return materia;
};