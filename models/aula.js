'use strict';
module.exports = (sequelize, DataTypes) => {
  const Aula = sequelize.define('Aula', {
    numero: DataTypes.STRING,
    edificio: DataTypes.STRING,
    fecInscripcion: DataTypes.DATE,
    fecNacimiento: DataTypes.DATE
  }, {tableName:"Aulas"});

    return Aula;
};