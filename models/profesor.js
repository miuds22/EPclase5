'use strict';
module.exports = (sequelize, DataTypes) => {
  const Profesor = sequelize.define('Profesor', {
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING
  }, {tableName:"Profesores"});
  

   Profesor.associate = function(models) {
    Profesor.hasMany(models.materia ,
      {foreignKey:"profesor_id"}
      )
  } 


  return Profesor;
};